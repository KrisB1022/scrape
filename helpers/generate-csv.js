const { csvFormat } = require('d3-dsv')
const { writeFileSync } = require('fs')
const dataFormat = require('./data-format')

const generateCsv = (data, csvFileName) => {
    try {
        if(data == 'null') return
        
        data = dataFormat(data)
        const csvData = csvFormat( data )

        writeFileSync(`./${csvFileName}.csv`, csvData, { encoding: 'utf8' })
        return true
    }  catch(e) {
        console.log(e)
    }
}

module.exports = generateCsv
