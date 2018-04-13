var Promise = require('bluebird')
var express = require('express') 
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json({ type: 'application/json'})
const { PostListingToSlack,findPointOfInterest,transitTime} = require('./utils')
const {insert,query} = require('./actions')


app.listen(4000);

console.log("Listening on port", 4000)

app.get('/notifications', async(req,resp)=>{
	let kijijiQuery = await query()
	let data = await kijijiQuery.reduce(async (previousPromise,item) => {
		let collection = await previousPromise
		let results = await findPointOfInterest([item['geo:lat'],item['geo:long']])
		Object.assign(item,results)
		if(item['neighborhood'].length != 0 || item['stations'].length != 0){
			const data = await Object.assign({},{lat:item['geo:lat'],long:item['geo:long'],price:item['g-core:price']})
				const isNotDuplicated = await insert(data)
				if(isNotDuplicated){
					let commuting = await transitTime([item['geo:lat'],item['geo:long']])
					collection.push(Object.assign(item,{'commuting':commuting}))
				}
			}
		return collection
		},Promise.resolve([]))
	PostListingToSlack(data)
	resp.json(data)
})


app.get('/notifications1', async(req,resp)=>{
	let kijijiQuery = await query()
	let data = await Promise.all(kijijiQuery.map(async x=>{
		let results = await findPointOfInterest([x['geo:lat'],x['geo:long']])
		return Object.assign(x,results)
	})).filter(async y =>{
		if(y['neighborhood'].length != 0 || y['stations'].length != 0){
			const data = Object.assign({},{lat:y['geo:lat'],long:y['geo:long'],price:y['g-core:price']})
			try {
				let result = await insert(data)
				return result 
			} catch(e){
				return false
			}
		}
		return false
	})
	PostListingToSlack(data)
	resp.json(data)
})