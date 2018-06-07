const Promise = require('bluebird')
let express = require('express');
let router = express.Router();
let pick = require('lodash/pick')
let map = require('lodash/map')
const { findPointOfInterest,transitTime} = require('./utils')
const { insert,query,postListingToSlack } = require('./actions')
const { prefs_obj,params_obj,simpleKeysValueObj } = require('./models')



router.get('/:channel/kijiji', async(req,resp)=>{
	let params = req.query
	let channelName = req.params.channel
	
	let parameters = pick(params,Object.keys(params_obj))
	let preference = pick(params,Object.keys(prefs_obj))
	
	let kijijiQuery = await query(preference,parameters)
	let data = await kijijiQuery.reduce(async(previousPromise,item) => {
		let collection = await previousPromise;
		let kv = pick(item,Object.keys(simpleKeysValueObj))
		const isNotDuplicated = await insert(item).catch((resolve => resolve))
		if (isNotDuplicated){
			collection.push(item);
		}
		return collection
		},Promise.resolve([]))
	postListingToSlack(data,channelName)
	resp.json(data)
})

module.exports = router;

// curl 'localhost:4001/api/road-bikes/kijiji?locationId=1700281&categoryId=648&maxPrice=500'
// curl 'localhost:4001/api/bike-fixies/kijiji?locationId=1700281&categoryId=15096002&maxPrice=500'