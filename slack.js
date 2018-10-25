const { WebClient } = require('@slack/client')
const SLACK_TOKEN = process.env.SLACK_TOKEN
const web = new WebClient(SLACK_TOKEN)

if (SLACK_TOKEN === undefined) {
  console.warn('SLACK_TOKEN is not Defined')
}
// Configuration Slack
// You need to export your Slack into your env

module.exports = web
