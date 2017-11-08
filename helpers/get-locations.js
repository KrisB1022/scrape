const Nightmare = require('nightmare')

const evaluateLinks = async (nightmare) => {
    const links = await nightmare
        .evaluate(() => {
            return [...document.querySelectorAll('.sitemap ul li a')]
                .filter(el => el.href.indexOf('?page=') == -1)
                .map(el => [el.innerText, el.href])
        })
    return links
}

const getLocations = async url => {
    console.log(`Grabbing locations from ${url}`)
    const nightmare = new Nightmare({ show: true })
    const tempArr = []
    let next = true
    let i = 1

    try {
        await nightmare.goto(url).wait('.sitemap')

        while(next) {
            await nightmare.wait('.sitemap')
            console.log('  checking page ...', i)
            tempArr.push(await evaluateLinks(nightmare))
            
            const nextPresent = await nightmare.exists('.sitemap .next a')
            if(nextPresent && i <= 8) {
                nightmare.click('.sitemap .next a')
                i++
            } else {
                next = false
                await nightmare.end()
            }
        }

        return tempArr
        
    } catch (err) {
        console.error(err)
    }
}

module.exports = getLocations
