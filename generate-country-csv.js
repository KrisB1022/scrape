const getUrls = require('./helpers/get-urls')
const getLocations = require('./helpers/get-locations')
const generateCsv = require('./helpers/generate-csv')
const { readFileSync } = require('fs')

const countries = readFileSync('./sitemap/countries/country-list.csv', { encoding: 'utf8' }).trim().split('\n')

const sitemapUrls = countries.reduce(async (queue, country) => {
    let data = await queue
    let location = country.split(',')
    let url = location[1]
    let name = location[0]

    try {
        if(url.indexOf('http') != -1) {
            const locationUrls = await getLocations(url)
            const fileName = `sitemap/countries/${name}`
            if(generateCsv(locationUrls, fileName)) console.log(`Successfully created ./${fileName}.csv\n`)
            return data
        } else {
            return undefined
        }
    } catch(e) {
        console.error(e)
        return undefined
    }

}, Promise.resolve([]))

sitemapUrls.then(data => {
    console.log(data)
})
.catch(e => console.error('Error block: ', e))


// open each country page
//     if links are search - [...document.querySelectorAll('div.sitemap ul li a')][0].href.indexOf('sitemap')
//         append to final output.csv
//     else links are sitemap
//         loop through each new link
//             if links are search 
//                 append to final output.csv
//             else links are sitemap
//                 repeat

