
-) npm install

-) Get Google API credentials as described here https://developers.google.com/calendar/quickstart/nodejs

-) node getGoogleToken.js

-) Follow this guide to create a slack token https://slack.dev/node-slack-sdk/getting-started
Store this slack token in ./slack_token.js, and the conversation ID to which you want to post (how to find a conversationId https://stackoverflow.com/questions/40940327/what-is-the-simplest-way-to-find-a-slack-team-id-and-a-channel-id).

-) node main.js