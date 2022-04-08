/**
 * Required External Modules
 */

import * as dotenv from "dotenv";

import {TwitterApi} from 'twitter-api-v2';
import moment from 'moment';

dotenv.config();

/**
 * App Variables
 */

if (!process.env.APP_KEY) {
   process.exit(1);
}

async function main() {
  try {
    // Instanciate with desired auth type (here's Bearer v2 auth)
    //const twitterClient = new TwitterApi(process.env.BEARER_TOKEN);
    const consumerClient = new TwitterApi({ 
      appKey: process.env.APP_KEY, 
      appSecret: process.env.APP_SECRET,
      accessToken: process.env.ACCESS_TOKEN,
      accessSecret: process.env.ACCESS_SECRET,
    });

    const userId= process.env.USER_ID;
    const selfUserId= process.env.SELF_USER_ID;

    // Get tweets by userId of last day
    const start_time = moment().subtract(1, "days").toISOString();
    const tweetOptions= {
      exclude: 'retweets,replies',
      start_time,
      max_results: '100'
    };
    const tweetsOfUser = await consumerClient.v2.userTimeline(userId, tweetOptions);
    const data= tweetsOfUser._realData.data;

    //  Liking all tweets in parallel
    var responses = await Promise.all(data.map(async (tweet) => {
      const {id, text}= tweet;
      await consumerClient.v2.like(selfUserId, tweet.id);
      console.log(`Liked tweet id: ${id}, text: ${text}`);
      return id;
    }));

  } catch (e) {
    console.error(JSON.stringify(e.message));
  }
}

main();
