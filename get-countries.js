const getLocations = require('./helpers/get-locations')
const generateCsv = require('./helpers/generate-csv')

const locations = ['https://www.airbnb.com/sitemaps'].reduce(async (queue, url) => {
    const dataArr = await queue
    dataArr.push(await getLocations(url))
    return dataArr
}, Promise.resolve([]))    

locations.then(data => {
    const csvFileName = 'sitemap/countries/country-list'
    if(generateCsv(data[0], csvFileName)) console.log(`Successfully created ./${csvFileName}.csv\n`)
})
.catch(e => console.error(e))
