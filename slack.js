const { WebClient } = require('@slack/client')
const web = new WebClient(process.env.SLACK_TOKEN)

if (web !== '') {
  console.warn('SLACK_TOKEN is not Defined')
}
// Configuration Slack
// You need to export your Slack into your env

module.exports = web
