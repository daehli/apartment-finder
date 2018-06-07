const { WebClient } = require('@slack/client');
const web = new WebClient(process.env.SLACK_TOKEN)

// Configuration Slack 
// You need to export your Slack into your env 


module.exports = web