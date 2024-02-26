const {basic_value, weekdays, months_titles, sizes, time_format_middle_border, time_format_max_border, time_start, base, date_filters, rome_nums} = require('./data')

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

    filter(date, period = 'day', check = '') {
        let current = this.getDatePeriodValue(date, period)

        return eval(current+check)
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

    random(isTime = true, num = 5) {
        let result = []

        for (let i = 0; i < num; i++) {
            let number = isTime ? time_format_max_border : 30

            number = parseInt(Math.random() * number)

            result = [...result, number]
        }

        result = result.map(el => {
            return isTime ? this.time(el) : this.move('day', '-', el)
        })

        return result
    }

    range(dates = [], period = 'day') {
        let indexes = []
        let max = 0
        let min = 10**6

        dates.map(el => {
            let value = this.getDatePeriodValue(el, period)

            indexes = [...indexes, value]
        })

        for (let i = 0; i < indexes.length; i++) {
            let value = indexes[i]

            if (max < value) {
                max = value
            } else if (min > value) {
                min = value
            }
        }

        return max - min
    }

    convert(value = null, key = 'convert') {
        let result 

        if (key === 'convert') {
            result = '' 

            let volume = Math.abs(value) 
            let isBorder = (volume + 1) % 5 === 0 

            if (isBorder) {
                volume++
            }

            let part = rome_nums.findLast(el => el.value <= volume)
            
            while (volume > 0 && part !== undefined) {

                result += isBorder && volume - part.value === 0 ? 'I' + part.title : part.title
                volume -= part.value

                part = rome_nums.findLast(el => el.value <= volume)  
            }

        } else if (key === 'deconvert') {
            result = 0

            let arr = value.split('')
            let isBorder = false

            for (let i = 1; i < arr.length; i++) {
                let current = arr[i]
                let prev = arr[i - 1]

                isBorder = prev === 'I' && current !== 'I'

                let num = isBorder ? rome_nums.find(el => el.title === current) : rome_nums.find(el => el.title === prev)
              
                if (num !== undefined) {
                    result += isBorder ? num.value - 1 : num.value
                }
            }    

            result = isBorder ? result : result + 1
        }

        return result
    }

    border(num = null, isRome = false) {
        let value = isRome ? this.convert(num, 'deconvert') : num  
        let borders = [(value - 1)*10**2 + 1, value*10**2]

        return borders
    }

    century(year = 1000, isRome = false) {
        let num = Math.ceil(year / 100)
    
        return isRome ? this.convert(num, 'convert') : num
    }
    
    timestamp() {
        let date = this.move()
        let time = this.date.getHours() + ':' + this.date.getMinutes()
        
        return `${date} | ${time}`
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

module.exports = Core