/**
 * Required External Modules
 */

import dotenv from 'dotenv'

import { TwitterApi } from 'twitter-api-v2'
import moment from 'moment'
import { IncomingWebhook } from '@slack/webhook'

dotenv.config()

/**
 * App Variables
 */

if (!process.env.CONSUMER_KEY) {
  console.error('Set enviroment variables')
  process.exit(1)
}

const userId = process.env.USER_ID
const friendUserId = process.env.FRIEND_USER_ID

// Get time minus minutes
const checkMinutes = process.env.CHECK_MINUTES || 15
const start_time = moment().subtract(checkMinutes, 'minutes').toISOString()
const tweetOptions = {
  exclude: 'retweets,replies',
  start_time,
  max_results: '100',
}
// Instanciate with desired auth type
const consumerClient = new TwitterApi({
  appKey: process.env.CONSUMER_KEY,
  appSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_SECRET,
})

/**
 * App Functions
 */
const getTweets = async (id) => {
  const userTweets = await consumerClient.v2.userTimeline(id, tweetOptions)
  return userTweets._realData.data || []
}

const likeTweet = async (tweet) => {
  const { id } = tweet
  await consumerClient.v2.like(userId, id)
  console.log(`Liked tweet id: ${id}`)
  return id
}

const sendSlackNotification = async (message) => {
  const url = process.env.SLACK_WEBHOOK_URL

  const webhook = new IncomingWebhook(url)

  await webhook.send({
    text: message,
  })
}

/**
 * Main Functions
 */
async function main() {
  const userTweets = await getTweets(friendUserId)

  const count = userTweets.length
  let message = ''
  if (count) {
    //  Liking all tweets in parallel
    await Promise.all(userTweets.map(likeTweet))

    message = `${count} new tweet${count > 1 ? 's' : ''}.`
    if (process.env.SLACK_WEBHOOK_URL) {
      await sendSlackNotification(message)
    }
  } else {
    message = 'No new tweets.'
  }
  console.log(message)
  return message
}

export const handler = async (_event) => {
  const message = await main()
  const response = {
    statusCode: 200,
    body: message,
  }
  return response
}
