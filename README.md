# Simple bot to like a friend tweets

Bot to automatically like your friends' tweets, and notify you on your Slack channel.

### Practical use cases

 - You are like me. You don't have time to check social media and you want to give attention to someone.
 - You are in a relationship. Your girlfriend is constantly nagging you for not being the `first-one` to like her tweets.

How does it work?
================  

 This script runs tweeter API and checks for any new tweets for a paticular `user_id` in last 15 minutes. If a new a tweet is found it likes the tweet and sends a notification to your configured Slack channel using Slack Webhooks.

Installation
===============

 - `git clone https://github.com/alianjum0/tweet-like-bot`
 - `npm install`
 - create a `.env` file (you must set `USER_ID` (Self user id), `FRIEND_USER_ID` (Friend user id) from [TweeterId](https://tweeterid.com),`CONSUMER_KEY`,`CONSUMER_SECRET`, `ACCESS_TOKEN, `ACCESS_SECRET`, `CHECK_MINUTES` and `SLACK_WEBHOOK_URL` from [Slack Webhooks](https://api.slack.com/incoming-webhooks) ) as shown in file [.env.example](/.env.example)
 This would assure that your keys are secured and index.js file is untouched.
 - `npm start` (run the app, and like all the recent tweets (test) and send slack webhook notification)

Deploying on Lambda
===============

 - `git clone https://github.com/alianjum0/tweet-like-bot
 - `zip -r -D tweet-like-bot.zip node_modules index.js .env package.json`
 - `aws lambda update-function-code --function-name tweet-like-bot --region eu-central-1 --zip-file fileb://tweet-like-bot.zip`
 - `aws lambda invoke --function-name tweet-like-bot --region eu-central-1 out
   --log-type Tail`

Deploy to Lambda using Github Actions
===============

 - In Github Action "Set up a workflow yourself"
 - Copy and paste code from [src/main.yml](/src/main.yml)
 - Add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to Github Settings>Secrets>Actions
 - Change `aws_region` and `function_name`

 Thanks
=================

Inspired from https://github.com/gulzar1996/auto-like-my-gf-insta-pic.
