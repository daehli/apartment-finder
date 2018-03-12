var Promise = require('bluebird')
var express = require('express') 
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json({ type: 'application/json'})
const { PostListingToSlack,findPointOfInterest} = require('./utils')
const {insert,query} = require('./actions')

// Cron Jobs + adding data to data base 
app.listen(4000);
console.log("Listening on port", 4000)

app.get('/insert', async (req,resp)=>{
	try {
       	let result = await insert({"name":"daehli"}) 
       	console.log(result)
       	resp.send(result)
    } catch(e) {
        console.log(e)
        resp.send(e)
    }
})

app.get('/notifications', async(req,resp)=>{
	let kijijiQuery = await query()

	let data = await Promise.all(kijijiQuery.map(async x=>{
        // console.log(
        console.log(x['link'])
		let results = await findPointOfInterest([x['geo:lat'],x['geo:long']])
		return Object.assign(x,results)
	})).filter(async y =>{
		if(y['neighborhood']['found'] || y['stations']['found']){
			const data = Object.assign({},{lat:y['geo:lat'],long:y['geo:long'],price:y['g-core:price']})
			console.log(data)
			try {
				let result = await insert(data)
				console.log(result)
				return result 
			} catch(e){
				console.log(e)
				return false
			}
		}
		return false
	})

	PostListingToSlack(data)
	resp.json(data)
})