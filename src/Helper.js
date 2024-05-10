const {sizes, months, date_sizes} = require('./data')

class HelperContainer {
    percent(value = 0, total = 100, round = 1) {
        let result = value / total * 100
        
        return round === 0 ? Math.floor(result) : parseFloat(result.toFixed(round))
    }

    splin(value = '', first, second) {
        return value.split(first).join(second)
    }

    reverse(item = '') {
        return item.split('').reverse().join('')
    }

    rounding(num) {
        return num < 10 ? `0${num}` : num 
    }

    toNum(num) {
        return Math.floor(num) < 10 ? `0${num}` : num 
    }

    parts(text = '', marker = ':', isNum = false) {
        let result = text.split(marker)

        return isNum ? result.map(el => Number(el)) : result
    }

    getYearSize(year) {
        return year % 4 === 0 ? 366 : 365
    }

    getMonth(month) {
        let result = months.find(el => el.includes(month))
        let check = result !== undefined

        let title = check ? result : months[0]
        let index = check ? months.indexOf(title) + 1 : 0

        return {title, index: this.toNum(index)}
    }

    getSize(flag) {
        return sizes.find(el => el.title === flag)?.value
    }

    getUTC(utc =  0) {
        let timestamp = this.date.getUTCHours() + utc

        timestamp *= 60
        timestamp += this.date.getMinutes()

        return timestamp
    }

    getDateNum(date) {
        let check = num => num > 0
        let parts = this.parts(date, '.', true)
        let result = 0
             
        parts.map((el, index) => {
            let value = check(index) ? el - 1 : el

            value *= date_sizes[index]
        
            result += value
        })

        return result
    }
}

module.exports = HelperContainer