const {basic_value, weekdays, months_titles, sizes, time_format_middle_border, time_format_max_border, time_start, base} = require('./data')

class Core {
    constructor() {
        if (Core.flag) {
            return Core.instance
        }

        Core.flag = true
        Core.instance = this
    
        this.init()
    }

    get index() {
        return this.date.getDay() === 0 ? 6 : this.date.getDay() - 1
    }

    init() {
        this.value = Date.now()
        this.date = new Date()
        this.weekday = weekdays[this.index]?.title
    }

    move(flag = 'day', direction = '+', num = 0, format = 'default') {
        this.init()
        
        let value = this.value 
        let size = this.getSize(flag) | basic_value
      
        value = eval(`${value}${direction}(${num}*${size})`)

        return this.formatting(new Date(value), format)
    }

    gap(weekday = null, key = 'tag') {
        let result = 0
        weekday = weekday === null ? weekdays[this.index]?.tag : weekday
        
        weekdays.find((el, idx) => {
            if (el[key] === weekday) {
                let difference = Math.abs(idx - this.index)

                result = this.index <= idx ? difference : 7 - difference 
            }
        })

        return result
    }

    dates(flag = 'week', num = 2, weekday = null, format = 'default') {
        this.init()

        let result = []
        let size = this.getSize(flag) 
        let value = this.value
        let gap = this.gap(weekday)
        
        value += (basic_value * gap)

        for (let i = 0; i < num; i++) {
            result = [...result, this.formatting(new Date(value), format)]
            value += size
        }   

        return result
    }

    filter(date, period = 'day', value = 0) {
        let parts = date.split('.').map(el => parseInt(el))
        let current = 0

        if (period === 'day') {
            current = parts[0]
        } else if (period === 'month') {
            current = parts[1]
        } else if (period === 'year') {
            current = parts[2]
        }

        return current === value
    }

    difference(date, side = '+', flag = 'day', lock = 10) {
        let result = 0
        let origin = this.move()
        let size = this.getSize(flag) || base
      
        while (origin !== date && result < lock) {
            result++
            origin = this.move('day', side, result)
        }
        
        if (origin !== date) {

            let new_side = side === '+' ? '-' : '+' 

            return this.difference(date, new_side, lock)
        }

        return parseFloat((result * base / size).toFixed(1))
    }

    day(key = 'start', size = 'hour') {
        let result = 0
        let date = this.move()

        while (date === this.move()) {
            result++
            date = this.move(size, key === 'start' ? '-' : '+', result)
        }

        result--

        return result
    }

    time(value = null, key = 'convert', isTwelve = false) {
        let result = null

        if (key === 'convert') {
            let h = Math.floor(value / 60)
            let m = value % 60

            h = value > time_format_middle_border && isTwelve ? Math.floor((value - time_format_middle_border) / 60) : h

            result = `${this.rounding(h)}:${this.rounding(m)}`
        } else {
            let parts = value.split(':').map(el => parseInt(el))
            
            result = parts[0] * 60 + parts[1]

            result = result > time_format_middle_border && isTwelve ? result - time_format_middle_border : result
        }

        return result
    }

    times(start = time_start, period = 30, num = 10) {   
        let result = []
        let counter = this.time(start, 'deconvert')
        
        let isPass = (counter + period * num) <= time_format_max_border

        if (!isPass) {
            return []
        }

        for (let i = 0; i < num; i++) {
            let value = this.time(counter)

            result = [...result, value]

            counter += period
        }

        return result
    }
    
    rounding(num) {
        return num < 10 ? `0${num}` : num 
    }

    formatting(date, type) {
        let result = date.toString()
        let pieces = result.split(' ')

        if (type === 'default') {
            result = `${pieces[2]}.${this.getMonth(pieces[1]).index}.${pieces[3]}`
        } else if (type === 'mail') {
            result = `${pieces[2]} of ${this.getMonth(pieces[1]).title} ${pieces[3]}`
        }

        return result
    }

    toNum(num) {
        return Math.floor(num) < 10 ? `0${num}` : num 
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

module.exports = Core