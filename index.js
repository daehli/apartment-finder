let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let jsonParser = bodyParser.json({ type: 'application/json' })

let notifications = require('./router')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', notifications)

console.log('Listening on port', 4000)

app.listen(4000)
