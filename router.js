const Promise = require('bluebird')
let express = require('express');
let router = express.Router();
let pick = require('lodash/pick')
let map = require('lodash/map')
const { PostListingToSlack,findPointOfInterest,transitTime} = require('./utils')
const { insert,query } = require('./actions')
const { prefs_obj,params_obj } = require('./models')



// c => categories l = locations
router.get('/kijiji', async(req,resp)=>{
	let params = req.query	
	
	let parameters = pick(params,Object.keys(params_obj))
	let preference = pick(params,Object.keys(prefs_obj))
	
	let kijijiQuery = await query(preference,parameters)
	let data = await kijijiQuery.reduce(async(previousPromise,item) => {
		let collection = await previousPromise;
		const isNotDuplicated = await insert(item).catch((resolve => resolve))
		if (isNotDuplicated){
			collection.push(item);
		}
		return collection
		},Promise.resolve([]))
	PostListingToSlack(data)
	resp.json(data)
})

module.exports = router;

// curl 'localhost:4001/api/kijiji?locationId=1700281&categoryId=648&maxPrice=500'

// Should create pref_obj & params_obj