const getLocations = require('./get-locations')
const generateCsv = require('./generate-csv')

const getUrls = async (urls, csvFileName) => {
    const locations = urls.reduce(async (queue, url) => {
        const dataArr = await queue
        dataArr.push(await getLocations(url))
        return dataArr
    }, Promise.resolve([]))    
    
    locations.then(data => {
        if(generateCsv(data, csvFileName)) console.log(`Successfully created ./${csvFileName}.csv\n`)
    })
    .catch(e => console.error(e))
}

module.exports = getUrls