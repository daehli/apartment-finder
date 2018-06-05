const Promise = require('bluebird')
const { WebClient } = require('@slack/client');
const rp = require('request-promise')
const SETTINGS = require('./settings')
const web = new WebClient(process.env.SLACK_TOKEN)
const moment = require('moment')
const _  = require('lodash')

if(typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}

const coordDistance = (coord1,coord2)=>{

    const decimals = 2;
    var earthRadius = 6371; // km
    lat1 = parseFloat(coord1[0])
    lat2 = parseFloat(coord2[0])
    lon1 = parseFloat(coord1[1])
    lon2 = parseFloat(coord2[1])

    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = earthRadius * c;
    return Math.round(d * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

const inBox = (coords,box)=> {
    if (box[0][0] <= coords[0] && coords[0] <= box[1][0] && box[1][1] >= coords[1] && coords[1] >= box[0][1]){
        return true
    }
    return false
}


const PostListingToSlack = (listing)=> {
    listing.map(async x=>{
    desc = `🍩 ${x['title']}  | 💰${x['g-core:price']} \n 🔗 <${x['link']}>`
    web.chat.postMessage({ channel: SETTINGS.CHANNEL , username: SETTINGS.USERNAME, icon_emoji:":robot_face:", text:desc, unfurl_links: true, unfurl_media: true })
    })
}

const buildCommutingString = (obj) => {
    if(obj.length != 0){
        return obj.map(x=>{
            if(x['transport'] == 'bicycling'){
                return `\t \t🚲 - duration : ${x.duration} to ${x.commuting}`
            } else {
                return `\t \t🚍 - duration : ${x.duration} to ${x.commuting}`
            }
        }).join("\n")
    }
}

const findPointOfInterest =  async geotag => {

    return await new Promise((resolve,reject)=>{
        // Check neighborhood 
        let neighborhood = findNeighborhood(geotag).filter(x=>x.found)
        // Check subways Stations 
        let stations = findStations(geotag).filter(x=>x.found)
        resolve(Object.assign({neighborhood},{stations}))
    })
}

const findNeighborhood = geotag => {
    // Return a list of Neighborhood

    let arrNeighborhood = []
    for (const props in SETTINGS.BOXES){
        let neighborhood = SETTINGS.BOXES[props]
        if (inBox(geotag, neighborhood)){
            arrNeighborhood.push(Object.assign({},{found:true,name:props}))
        }
        arrNeighborhood.push(Object.assign({},{found:false}))
    }

    return arrNeighborhood
}

const findStations = geotag => {
    let arrStations = []
    for (const props in SETTINGS.STATIONS){
        const station = SETTINGS.STATIONS[props]
        const stationName = `STATIONS.${props}`
        let dist = coordDistance(station,geotag)
        if(0 < dist && dist <= SETTINGS.MAX_TRANSIT_DIST){
            arrStations.push(Object.assign({},{found:true,name:props,distance:dist}))
        }
        arrStations.push(Object.assign({},{found:false}))
    }

    return arrStations
}

const isMoreThanMaxTransitTime = async (geotag,transport)=> {

    let arrCommutingPlace = []

    for(const props in SETTINGS.COMMUTING_PLACE){
        // Promise on loop with google maps 
        null
    }
    let options = {
        uri:'https://maps.googleapis.com/maps/api/directions/json',
        qs: {
            'origin':commutingPlace,
        }
    }
    rq('https://maps.googleapis.com/maps/api/directions/')
}




// bicycling, driving, walking, transit
const transitTime = async (geotag,transports = ['bicycling','transit']) => {
    return await new Promise(async (resolve,reject)=>{
        let arrCommutingTime = []
        let tomorrowAt8Am = moment().add(1,'days').hours(8).minutes(0).unix()
        for (const props in SETTINGS.COMMUTING_PLACE){
            const commutingPlace = SETTINGS.COMMUTING_PLACE[props]
            const commutingNamePlace = `${props}`
            for(const transport in transports){
                const transportName = transports[transport]
                let options = {
                    uri:'https://maps.googleapis.com/maps/api/directions/json',
                    qs: {
                        'origin':_.map(commutingPlace,x => {return x}).join(','),
                        'destination':_.map(geotag,x => {return x}).join(','),
                        'mode': transportName,
                        'departure_time': tomorrowAt8Am,
                        'key': process.env.GOOGLE_KEYS_API
                    }
                }
                await rp(options).then(data=>{
                    const json = JSON.parse(data)
                    let obj = Object.assign({},{'transport':transportName,'duration':json['routes'][0]['legs'][0]['duration']['text'],'commuting':commutingNamePlace})
                    arrCommutingTime.push(obj)
                }).catch(err=>{
                    reject(`WTF ${err}`)
                })
            }
        }
        resolve(arrCommutingTime)
    })
}
module.exports = { coordDistance, inBox , PostListingToSlack,findPointOfInterest, transitTime, isMoreThanMaxTransitTime};


