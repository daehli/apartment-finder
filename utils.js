const Promise = require('bluebird')
const kijiji = require("kijiji-scraper")
const SETTINGS = require('./settings')
const { WebClient } = require('@slack/client');

const web = new WebClient(process.env.SLACK_TOKEN)


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
    // Coords = 45.523808,-73.584556
    // Of the box 45.548161, -73.609838
    // Box = [45.522499, -73.591313],[45.527092, -73.564397]
     // 45.522499 < 45.523808 && 45.523808 < 45.527092
     // -73.564397 >= -73.584556 && -73.584556 >= -73.591313
     // -73.564397 > -73.584556 > -73.591313
    // Check latitude first after longitude 
    if (box[0][0] <= coords[0] && coords[0] <= box[1][0] && box[1][1] >= coords[1] && coords[1] >= box[0][1]){
        return true
    }
    return false
}


const PostListingToSlack = (listing)=> {
    listing.map(async x=>{
        // Register This 
        // console.log(x['geo:lat'])
        // console.log(x['geo:long'])
        // console.log(x['g-core:price'])

    const neighborhood = x['neighborhood']['found'] ? x['neighborhood']['name']: x['stations']['name']
    const stations = x['stations']['found'] ? x['stations']['name']: x['neighborhood']['name']
    desc = `🍩 ${x['title']}  | 💰${x['g-core:price']} | 🚋 ${stations} | 🌳 ${neighborhood}  | 🔗 <${x['link']}>`

    web.chat.postMessage({ channel: '#général',username: "Corgi", icon_emoji:":robot_face:",text:desc })
    })
}

const findPointOfInterest =  async geotag => {

    return await new Promise((resolve,reject)=>{
        // Check neighborhood 
        let neighborhood = findNeighborhood(geotag)

        // Check subways Stations 
        let stations = findStations(geotag)
        resolve(Object.assign({neighborhood},{stations}))
    })
}

const findNeighborhood = geotag => {
    for (const props in SETTINGS.BOXES){
        let neighborhood = SETTINGS.BOXES[props]
        if (inBox(geotag, neighborhood)){
            return Object.assign({},{found:true,name:props})
        }
        return Object.assign({},{found:false})
    }
}

const findStations = geotag => {
    for (const props in SETTINGS.STATIONS){
        const station = SETTINGS.STATIONS[props]
        const stationName = `STATIONS.${props}`
        let dist = coordDistance(station,geotag)
        if(0 < dist && dist <= SETTINGS.MAX_TRANSIT_DIST){
            return Object.assign({},{found:true,name:props,distance:dist})
        }
        return Object.assign({},{found:false})
    }
}

module.exports = { coordDistance, inBox , PostListingToSlack,findPointOfInterest};


// TODO Change Puts setting here 

// Kijiji Parameters
//  Prefs Objets 
// {
//     "locationId": <Kijiji location id>,
//     "categoryId": <Kijiji ad category id>,
//     "scrapeInnerAd": true/false (default true)
//      c216l1700281 Big appartement In Montreal
// }


// Params Object

// minPrice=400
// maxPrice=1800
// locationId=1700281
// categoryId=216
// keywords=petit+italie
// searchView=LIST
// urgentOnly=false
// cpoOnly=false
// carproofOnly=false
// highlightOnly=false
// gpTopAd=false
// sortByName=dateDesc
// adType=OFFER
// adPriceType=
// videoOnly=false
// hasImages=false
// formSubmit=true
// attributeMap%5BadType%5D=%5BOFFER%5D
// attributeMap%5Bnumberbathrooms_s%5D=%5B20%5D
// address=H2S
// radius=2.0
