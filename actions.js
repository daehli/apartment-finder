const db = require('./knexfile')
const knex = require('knex')(process.env.PRODUCTION ? db['production'] : db['development'] )
const Promise = require('bluebird')
const kijiji = require("kijiji-scraper")
const SETTINGS = require('./settings')

const insert = async data => {
	return new Promise((resolve,reject)=>{
		knex('Listing').insert({"kv":JSON.stringify(data)}).then(data=>{
			resolve(true)
		}).catch(err =>{
			reject(false)
		})
	})
}

const query = async (pref_obj,params_obj) => {
        return new Promise((resolve,reject)=>{ 
            kijiji.query(pref_obj,params_obj, async (err, ad) => {
                if(err){
                    reject(err)
                }
                resolve(ad)
            })
        })
};

module.exports = { insert , query };
