# Simple bot to like a friend tweets

Bot to automatically like your friends' tweets, and notify you on your Slack channel.

### Practical use cases

 - You are like me. You don't have time to check social media and you want to give attention to someone.
 - You are in a relationship. Your girlfriend is constantly nagging you for not being the `first-one` to like her tweets.

How does it work?
================  

 This script runs twitter API and checks for any new tweets for a paticular `user_id` in last 15 minutes. If a new a tweet is found it likes the tweet and sends a notification to your configured Slack channel using Slack Webhooks.

Installation
===============

 - `git clone https://github.com/alianjum0/tweet-like-bot`
 - `npm install`
 - create a `.env` file (you must set `USER_ID` (Self user id), `FRIEND_USER_ID` (Friend user id) from [TweeterId](https://tweeterid.com),`CONSUMER_KEY`,`CONSUMER_SECRET`, `ACCESS_TOKEN, `ACCESS_SECRET`, `CHECK_MINUTES` and `SLACK_WEBHOOK_URL` from [Slack Webhooks](https://api.slack.com/incoming-webhooks) ) as shown in file [.env.example](/.env.example)
 This would assure that your keys are secured and index.js file is untouched.
 - `npm start` (run the app, and like all the recent tweets (test) and send slack webhook notification)

Deploying on Lambda
===================

 - Create a lamda function `tweet-like-bot` using AWS Console
 - Create package: `zip -r -D tweet-like-bot.zip node_modules index.js .env package.json`
 - Upload package: `aws lambda update-function-code --function-name tweet-like-bot --region eu-central-1 --zip-file fileb://tweet-like-bot.zip`
 - Run Lambda: `aws lambda invoke --function-name tweet-like-bot --region eu-central-1 out --log-type Tail`

Deploy to Lambda using Github Actions
======================================

 - In Github Action "Set up a workflow yourself"
 - Copy and paste code from [src/main.yml](/src/main.yml)
 - Add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to Github Settings>Secrets>Actions
 - Change `aws_region` and `function_name`
 - Commit and check pipeline in Github Actions

Create EventBridge schedule event
================================

 - Cretae EventBridge rule to run lambda function every 15 minutes
```
aws events put-rule \
  --name like-bot-scheduled-rule \
  --region eu-central-1 \
  --schedule-expression 'rate(15 minutes)'
```
 - Add permission to invoke lamda function
```
aws lambda add-permission \
  --function-name tweet-like-bot \
  --region eu-central-1 \
  --statement-id like-bot-scheduled-event \
  --action 'lambda:InvokeFunction' \
  --principal events.amazonaws.com \
  --source-arn arn:aws:events:eu-central-1:849652647306:rule/like-bot-scheduled-rule
```
 - Add lamda function to run on the event
```
aws events put-targets --rule like-bot-scheduled-rule --targets file://src/targets.json

```

 Thanks
=================

Inspired from https://github.com/gulzar1996/auto-like-my-gf-insta-pic.
