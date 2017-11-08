const { csvFormat } = require('d3-dsv')
const Nightmare = require('nightmare')
const { readFileSync, writeFileSync } = require('fs')

const parsePrice = str => str.slice( str.indexOf('$') + 1, str.length - 1 )

const getPricing = async (cityName, url) => {
    console.log(`Now checking ${cityName}`)
    cityName = cityName.split(' ').join('-')
    const START = `${url}/homes`
    const nightmare = new Nightmare({ show: false })

    try {
        await nightmare
            .goto(START)
            .viewport(1280, 500)
            .wait('button[aria-controls="menuItemComponent-price"]')
            .click('button[aria-controls="menuItemComponent-price"]')
    } catch (e) {
        console.error(e)
    }

    try {
        const price = await nightmare
            .wait('#menuItemComponent-price div[role = "menu"] div div div span')
            .evaluate(() => {
                return [...document.querySelectorAll('#menuItemComponent-price div[role="menu"] div div div span')]
                    .map(el => el.innerText)
            })

        const location = await nightmare
            .wait('div[itemtype="http://schema.org/BreadcrumbList"] span[itemprop="name"]')
            .evaluate(() => {
                return [...document.querySelectorAll('div[itemtype="http://schema.org/BreadcrumbList"] span[itemprop="name"]')]
                    .map(el => el.innerText)
            })
            .end()
        return { cityName, price: parsePrice(price[2]), country: location[0], state: location[1] || 'na', city: location[2] || 'na' }
    } catch (e) {
        console.error(e)
        return undefined
    }
}

const locations = readFileSync('./sitemap/countries/Aruba/Aruba.csv', { encoding: 'utf8' }).trim().split('\n')
locations.shift()

const series = locations.reduce(async (queue, location) => {   
    const dataArr = await queue
    temp = location.split(',')
    dataArr.push(await getPricing(temp[0], temp[1]))
    return dataArr
}, Promise.resolve([]))

series.then(data => {
    if(data) {
        const csvData = csvFormat(data.filter(i => i))
        writeFileSync('./prices.csv', csvData, { encoding: 'utf8' })
    }
})
.catch(e => console.error(e))
