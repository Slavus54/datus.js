const {sizes, date_filters} = require('./data')

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

    getDatePeriodValue(date = '', period = '') {
        let parts = date.split('.').map(el => parseInt(el))
        let index = date_filters.indexOf(period)

        index = index > 0 ? index : 0
     
        return parts[index]
    }

    getMonth(month) {
        let result = months_titles.find(el => el.includes(month))
        let check = result !== undefined

        let title = check ? result : months_titles[0]
        let index = check ? months_titles.indexOf(title) + 1 : 0

        return {title, index: this.toNum(index)}
    }

    getSize(flag) {
        return sizes.find(el => el.title === flag)?.value
    }
}

module.exports = HelperContainer