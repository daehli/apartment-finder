const db = require('./knexfile')
const knex = require('knex')(process.env.PRODUCTION ? db['production'] : db['development'] )
const Promise = require('bluebird')
const kijiji = require("kijiji-scraper")
const SETTINGS = require('./settings')

const insert = async data => {
	return await new Promise((resolve,reject)=>{
        console.log(JSON.stringify(data))
		knex('Listing').insert({"kv":JSON.stringify(data)}).then(data=>{
			resolve(true)
		}).catch(err =>{
			reject(false)
		})
	})
}

const query = async () => {
        return new Promise((resolve,reject)=>{ 
            kijiji.query(SETTINGS.BIG_APPARTEMENT_SEARCH.pref,SETTINGS.BIG_APPARTEMENT_SEARCH.params, async (err, ad) => {
                if(err){
                    reject(err)
                }
                resolve(ad)
            })
        })
};


module.exports = { insert , query };
