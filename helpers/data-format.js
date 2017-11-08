const dataFormat = data => {
    const tempArr = []
    data = data.locations
    data.filter(i => i).forEach(item => {
        let tempObj = {}
        tempObj.location = item[0]
        tempObj.url = item[1]
        tempArr.push(tempObj)
    })

    return tempArr
}

module.exports = dataFormat
