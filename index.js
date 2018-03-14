var Promise = require('bluebird')
var express = require('express') 
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json({ type: 'application/json'})
const { PostListingToSlack,findPointOfInterest} = require('./utils')
const {insert,query} = require('./actions')


// # TODO :CRON FUNCTIONS http://handyjs.org/article/the-kick-ass-guide-to-creating-nodejs-cron-tasks 
app.listen(4000);

console.log("Listening on port", 4000)


// TODO : Add Router to Change File via a Post request

// Change sqlite to PostgresSQL

app.get('/notifications', async(req,resp)=>{
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