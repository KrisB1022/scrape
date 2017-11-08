const { csvFormat } = require('d3-dsv')
const Nightmare = require('nightmare')
const { readFileSync, writeFileSync } = require('fs')

const parsePrice = str => str.slice( str.indexOf('$') + 1, str.length - 1 )

const getPricing = async cityName => {
    console.log(`Now checking ${cityName}`)
    cityName = cityName.split(' ').join('-')
    const START = `https://www.airbnb.com/s/${cityName}/homes`
    const nightmare = new Nightmare({ show: true })

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
        return { cityName, price: parsePrice(price[2]), country: location[0], state: location[1], city: location[2] }
    } catch (e) {
        console.error(e)
        return undefined
    }
}

const locations = ['Seattle', 'Tacoma', 'New York']

const series = locations.reduce(async (queue, location) => {
    const dataArr = await queue
    dataArr.push(await getPricing(location))
    return dataArr
}, Promise.resolve([]))

series.then(data => {
    const csvData = csvFormat(data.filter(i => i))
    writeFileSync('./prices.csv', csvData, { encoding: 'utf8' })
})
.catch(e => console.error(e))
