const Nightmare = require('nightmare')

const getLocations = async url => {
    console.log(`Grabbing locations from ${url}`)
    const nightmare = new Nightmare({ show: false })

    try {
        const locations = await nightmare
            .goto(url)
            .wait('.sitemap')
            .evaluate(() => {
                return [...document.querySelectorAll('.sitemap ul li a')]
                    .map(el => [el.innerText, el.href])
            })
            .end()
        return { locations }
    } catch (err) {
        console.error(err)
    }
}

module.exports = getLocations
