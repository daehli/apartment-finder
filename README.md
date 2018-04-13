## Appartement Finder Kijiji 

## Goal

The Goal it's to have a bot that Scrach Kijiji to find all my desired Apartment.

## Installation 

- **NPM**

```bash
npm install 
```

- **Yarn**

```bash
yarn install
```

### Migrations 

- `Migrations`

```bash
npm migrations 
```

- `Rollback`

```bash
npm migrations_rollback
```


### Slack 
You need to create a Slack app to use the bots.

Import your Slack-Token 

```bash
EXPORT SLACK_TOKEN=xoxp-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX
```

Add Some informations in the Settings File

```plain
{
	"CHANNEL":"#YOUR_AMAZING_CHANNEL",
	"USERNAME":"BOTS_USERNAME
}
``` 


### Documentation

I use this [Library](https://github.com/mwpenny/kijiji-scraper) 


You can personalise your [Bots](https://github.com/mwpenny/kijiji-scraper#example-usage)


##### query(prefs, params, callback)

- `prefs` : Contains Kijiji ad Search category and locations

```plain
{
    "locationId": <Kijiji location id>,
    "categoryId": <Kijiji ad category id>,
    "scrapeInnerAd": true/false (default true)
}
```

- `params` : Contains Kijiji Side search to filter your ads you can pass has many argument you want.

```plain
{
	"minPrice":400
	"maxPrice":1800
	"locationId":1700281
	"categoryId":216
	"keywords":petit+italie
	"searchView":LIST
	"urgentOnly":false
	"cpoOnly":false
	"carproofOnly":false
	"highlightOnly":false
	"gpTopAd":false
	"sortByName":dateDesc
	"adType":OFFER
	"adPriceType":
	"videoOnly":false
	"hasImages":false
	"formSubmit":true
	"attributeMap%5BadType%5D":%5BOFFER%5D
	"attributeMap%5Bnumberbathrooms_s%5D":%5B20%5D
	"address":H2S
	"radius":2.0
}
```

> For more information you should go [here](https://github.com/mwpenny/kijiji-scraper#documentation) 


##### inBox(coords,box)

- `coords` : It's a single point on a map [45.523808,-73.584556]

- `box` : It's a paire a point on a map [[45.522499,-73.591313],[45.527092,-73.564397]]
  - 	First array is the down left corner
  - 	Second array is the top right corner 


A picture worth a thousand words

![](https://screenshotscdn.firefoxusercontent.com/images/7a045083-677a-44b7-9637-5839e9abc19b.jpg)


<!-- TODO Make the craiglist Scrapper 
	https://montreal.craigslist.ca/search/apa?format=rss
 -->
