const {sizes, periods, months} = require('./data')

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

    getDatePeriodValue(date = '', period = '') {
        let parts = date.split('.').map(el => parseInt(el))
        let index = periods.indexOf(period)

        index = index > 0 ? index : 0
     
        return parts[index]
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
}

module.exports = HelperContainer