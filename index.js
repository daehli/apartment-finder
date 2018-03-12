var Promise = require('bluebird')
var express = require('express') 
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json({ type: 'application/json'})
var db = require('./knexfile')
const { PostListingToSlack,findPointOfInterest,query} = require('./utils')

var bigAppartement = {
	pref: {
		'locationId':1700281,
		'categoryId':37,
		'scrapeInnerAd':false
	},

	params: {
		'minPrice':500,
		'maxPrice':2500,
		'keywords':'',
		'adType':'OFFER'
	}

}

app.listen(4000);
console.log("Listening on port", 4000)

app.get('/notifications', async(req,resp)=>{
	let kijijiQuery = await query()

	let data = await Promise.all(kijijiQuery.map(async x=>{
        // console.log(
        console.log(x['link'])
		let results = await findPointOfInterest([x['geo:lat'],x['geo:long']])
		return Object.assign(x,results)
	})).filter(async y =>{
		if(y['neighborhood']['found'] || y['stations']['found']){
			return true
		}
		return false
	})
	PostListingToSlack(data)
	resp.json(data)
})