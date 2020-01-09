const fs = require('fs');
const { google } = require('googleapis');

const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function listEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  let in_two_weeks = new Date();
  let in_three_weeks = new Date();
  in_two_weeks.setDate(in_two_weeks.getDate() + 14)
  in_three_weeks.setDate(in_three_weeks.getDate() + 21)
  calendar.events.list({
    calendarId: 'primary',
    timeMin: in_two_weeks.toISOString(),
    timeMax: in_three_weeks.toISOString(),
    maxResults: 100,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
      let found_working_hours = false
      for (let i = 0; i < events.length; i++) {
        if (events[i].summary.includes("work")) {
          found_working_hours = true
          continue
        }
      }
      if (!found_working_hours) {
        console.log("Book your working hours!")
        notificate()
      }
    } else {
      console.log('No upcoming events found.');
    }
  });
}



const { WebClient } = require('@slack/web-api');

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const slack = require("./slack.json");

const web = new WebClient(slack.token);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = slack.conversationId;

async function notificate () {
  // See: https://api.slack.com/methods/chat.postMessage
  const res = await web.chat.postMessage({ channel: conversationId, text: 'Book your working hours please!' });

  // `res` contains information about the posted message
  console.log('Message sent: ', res.ts);
};