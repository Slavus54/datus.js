const {sizes, datePeriods} = require('./data')

class HelperContainer {
    percent(value = 0, total = 1e2, round = 1) {
        let result = value / total * 1e2
        
        return this.toRound(result, round)
    }

    cleanValue(value = 0, total = 1e2, round = 0) {
        let result = value / 1e2 * total

        return this.toRound(result, round)
    }
    
    splin(value = '', first, second) {
        return value.split(first).join(second)
    }

    reverse(item = '') {
        return item.split('').reverse().join('')
    }

    rounding(num) {
        return num < 1e1 ? `0${num}` : num 
    }

    toRound(result, round = 0) {
        return parseFloat(result.toFixed(round))
    }
 
    toNum(num) {
        return Math.floor(num) < 1e1 ? `0${num}` : num 
    }

    parts(text = '', marker = ':', isNum = false) {
        let result = text.split(marker)

        return isNum ? result.map(el => Number(el)) : result
    }

    getYearSize(year) {
        return year % 4 === 0 ? 366 : 365
    }

    getSize(flag) {
        return sizes.find(el => el.title === flag)?.value
    }

    getUTC(utc =  0) {
        let timestamp = this.date.getUTCHours() + utc

        timestamp *= 6e1
        timestamp += this.date.getMinutes()

        return timestamp
    }

    getMonthSize(index = 0, year = 0) {
        let isEven = index % 2 === 0
        let size = 0    
    
        if (isEven && index < 7) {
            size = index === 2 ? this.getYearSize(year) === 365 ? 28 : 29 : 3e1
        } else if (!isEven && index > 7) {
            size = 30
        } else {
            size = 31
        }
       
        return size
    }

    getSymbol(isDate = true) {
        return isDate ? '.' : ':'
    }

    getIntervalValue(borders = []) {
        return Math.floor(borders[0] + Math.round(Math.random() * Math.abs(borders[0] - borders[1])))
    }

    getDatePeriodValue(date, period = 'day') {
        return Number(date.split('.')[datePeriods.indexOf(period)])
    }
}

module.exports = HelperContainer