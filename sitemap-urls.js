const getUrls = require('./helpers/get-urls')
const { readFileSync } = require('fs')

// const countries = series(['https://www.airbnb.com/sitemaps'], 'sitemap/countries')

const countries = readFileSync('./sitemap/countries.csv', { encoding: 'utf8' }).trim().split('\n')

const locations = countries.reduce(async (queue, country) => {
    const data = await queue
    const location = country.split(',')
    const url = location[1]
    const name = location[0]

    if(url.indexOf('http') != -1) {
        data.push( await(getUrls([url], `sitemap/${name}`)) )
    }

    return data
}, Promise.resolve([]))
locations.then(data => {
    console.log(data)
})
.catch(e => console.error(e))

const getLocationUrl = async () => {

}


// const locations = countries.reduce(async (queue, data) => {
//     counter+=1
//     if(counter >= 5) return

//     const location = data.split(',')
//     const url = location[1]
//     const locationName = location[0]
//     console.log(`Location: ${locationName} -- Url: ${url}`)
//     const result = await series([url], locationName)
// }, Promise.resolve([]))



// open each country page
//     if links are search - [...document.querySelectorAll('div.sitemap ul li a')][0].href.indexOf('sitemap')
//         append to final output.csv
//     else links are sitemap
//         loop through each new link
//             if links are search 
//                 append to final output.csv
//             else links are sitemap
//                 repeat

