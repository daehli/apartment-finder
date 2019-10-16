const Promise = require('bluebird')
const db = require('./knexfile')
const knex = require('knex')(db[process.env.NODE_ENV])
const slack = require('./slack')
const kijiji = require('kijiji-scraper')
const SETTINGS = require('./settings')

const insert = async data => {
    return new Promise((resolve, reject) => {
        knex('tbl_listing')
            .insert({ kv: JSON.stringify(data) })
            .then(data => {
                resolve(true)
            })
            .catch(err => {
                reject(err)
            })
    })
}

const query = async (pref_obj, params_obj) => {
    return new Promise((resolve, reject) => {
        kijiji.query(pref_obj, params_obj, async (err, ad) => {
            if (err) {
                reject(err)
            }
            resolve(ad)
        })
    })
}

const postListingToSlack = (listing, channel) => {
    listing.map(async x => {
        const desc = `🍩 ${x['title']}  | 💰${x['g-core:price']} \n 🔗 <${x['link']}>`
        slack.chat.postMessage({
            channel: `#${channel}`,
            username: SETTINGS.USERNAME,
            icon_emoji: ':robot_face:',
            text: desc,
            unfurl_links: true,
            unfurl_media: true
        })
    })
}

module.exports = { insert, query, postListingToSlack }
