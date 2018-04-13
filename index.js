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
				const isNotDuplicated = await insert(data).catch((resolve => resolve))
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

// [{"title":"Condo 4 1/2 meubl&#233;. Le Plateau Mont-Royal, 5 min m&#233;tro Laurier.","link":"https://www.kijiji.ca/v-appartement-condo-4-1-2/ville-de-montreal/condo-4-1-2-meuble-le-plateau-mont-royal-5-min-metro-laurier/1344244626","description":"Condo 4 1/2 meubl&#233;. Le Plateau Mont-Royal, 5 min m&#233;tro Laurier. Spacieux condo moderne 4 &#189; r&#233;nov&#233; en 2017 avec un grand salon, une chambre &#224; coucher ferm&#233;e et un bureau avec une sofa, plafond 9 pi. ...","enclosure":"","pubDate":"Mon, 02 Apr 2018 22:33:08 GMT","guid":"https://www.kijiji.ca/v-appartement-condo-4-1-2/ville-de-montreal/condo-4-1-2-meuble-le-plateau-mont-royal-5-min-metro-laurier/1344244626","dc:date":"2018-04-02T22:33:08Z","geo:lat":"45.5243055","geo:long":"-73.5851096","g-core:price":"1700.0","innerAd":{},"neighborhood":[{"found":true,"name":"Plateau"}],"stations":[{"found":true,"name":"Rosemount","distance":1.25},{"found":true,"name":"Laurier","distance":0.48},{"found":true,"name":"Mont-Royal","distance":0.31}]}]