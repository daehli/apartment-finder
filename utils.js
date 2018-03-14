const Promise = require('bluebird')
const { WebClient } = require('@slack/client');
const SETTINGS = require('./settings')
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
    if (box[0][0] <= coords[0] && coords[0] <= box[1][0] && box[1][1] >= coords[1] && coords[1] >= box[0][1]){
        return true
    }
    return false
}


const PostListingToSlack = (listing)=> {
    listing.map(async x=>{
    const neighborhood = x['neighborhood'].length != 0 ? x['neighborhood'].map(x=>x.name).join(" | ") : x['stations'].map(x=>x.name).join(" | ")
    const stations = x['stations'].length != 0 ? x['stations'].map(x=>`${x.name} -  ${x.distance} ㎞`).join(" | ") : x['neighborhood'].map(x=>x.name).join(" | ")

    desc = `🍩 ${x['title']}  | 💰${x['g-core:price']} \n Metro : \n \t🚋 ${stations} \n Quartier : \n \t 🌳 ${neighborhood} \n🔗 <${x['link']}>`

    web.chat.postMessage({ channel: SETTINGS.CHANNEL , username: SETTINGS.USERNAME, icon_emoji:":robot_face:", text:desc, unfurl_links: true, unfurl_media: true })
    })
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

module.exports = { coordDistance, inBox , PostListingToSlack,findPointOfInterest};


