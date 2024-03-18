const HelperContainer = require('./Helper')
const {basic_value, weekdays, months, minutesMid, minutesMax, time_start, base, rome_nums, sizes} = require('./data')

class Core extends HelperContainer {
    constructor() {
        super()

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

    move(flag = 'day', direction = '+', num = 0) {
        this.init()
        
        let value = this.value 
        let result = ''
        let size = this.getSize(flag) | basic_value
      
        value = eval(`${value}${direction}(${num}*${size})`)

        let pieces = new Date(value).toString().split(' ')
  
        result = `${pieces[2]}.${this.getMonth(pieces[1]).index}.${pieces[3]}`

        return result
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

    dates(flag = 'week', num = 2, weekday = null) {
        this.init()

        let result = []
        let size = Math.floor(this.getSize(flag) / base)
        let counter = this.gap(weekday)

        for (let i = 0; i < num; i++) {
            result = [...result, this.move(flag, '+', counter)]
            counter += size
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

            h = value > minutesMid && isTwelve ? Math.floor((value - minutesMid) / 60) : h

            result = `${this.rounding(h)}:${this.rounding(m)}`

        } else if ('deconvert') {
            let parts = value.split(':').map(el => parseInt(el))
            
            result = parts[0] * 60 + parts[1]

            result = result > minutesMid && isTwelve ? result - minutesMid : result
        }

        return result
    }

    times(start = time_start, period = 30, num = 10) {   
        let result = []
        let counter = this.time(start, 'deconvert')
        
        let isPass = (counter + period * num) <= minutesMax

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
            let number = isTime ? minutesMid : 30

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
    
    timestamp(format = 'all', divider = '|') {
        let minutes = this.date.getHours() * 60 + this.date.getMinutes()
        let date = this.move()
        let time = this.time(minutes)
        
        if (format === 'time') {
            return time
        } else if (format === 'date') {
            return date
        } 

        return `${date} ${divider} ${time}`
    }

    async utc() {
        let result = await fetch('https://towns-api.onrender.com/timezones') 

        result = await result.json()
    
        return result
    }

    distinction(time = '', utc = 0, isNum = true) {
        let result = 0
        let timestamp = this.date.getUTCHours() + utc
        let border = this.time(time, 'deconvert')

        timestamp *= 60
        timestamp += this.date.getMinutes()

        let isGone = border < timestamp

        result = Math.abs(border - timestamp)

        result = isNum ? this.time(result) : `${isGone ? 'Passed' : 'Pass in'} ${result} minutes`
    
        return {
            result,
            isGone
        }
    }
    
    palindrom(value = '', isDate = true) {
        let result = true
        let parts = value.split(isDate ? '.' : ':')
 
        result = isDate ?  
                this.reverse(parts[0]) === parts[2] && this.reverse(parts[1]) === parts[1]
            :
                this.reverse(parts[0]) === parts[1]
     
        return result
    }

    exchange(num = 10, from = 'minute', to = 'hour') {
        let result = 0

        let start = this.getSize(from) * num
        let end = this.getSize(to)

        result = Math.floor(start / end)
    
        return result
    }

    clock(value = 10, arrow = 'hour', isPositive = true) {
        const max = 12
        
        let result = 0
        let isMinute = arrow === 'minute'
        let current = isMinute ? value % 60 : Math.floor(value / 60)

        if (isMinute) {
            current = 12 + Math.floor(current / 5)
        }
        
        if (current === 0) {
            return 0
        }

        current = max - current
   
        let percent = this.percent(current, max, 0)
      
        percent += 25

        result = Math.floor(percent * 3.6)

        if (result < 0 && isPositive) {
            result += 360
        }
       
        return result
    }

    formula(start = '12:00', duration = 0, body = 'x + y - 1', size = 'minute') {
        let result = this.time(start, 'deconvert')
        size = this.getSize(size) * duration * 1440 / base

        body = this.splin(body, 'x', result)
        result = eval(this.splin(body, 'y', size))

        return this.time(result)
    }

    format(value = '', key = 'default', isDate = true) {
        let result = ''
        let parts = value.split(isDate ? '.' : ':') 

        if (key === 'default') {
            return value
        }

        if (isDate) {
            if (key === 'letter') {
                result = `${months[parts[1] - 1]} ${parts[0]}, ${parts[2]}`
            } 
        } else {
            if (key === 'us') {
                let count = this.time(value, 'deconvert') 
                let prefix = this.percent(count, minutesMax, 0) > 50
                let time = prefix ? this.time(count - 720) : value
                
                result = `${time} ${prefix ? 'PM' : 'AM'}`
            }
        }

        return result
    }

    part(num = 0, size = 'day') {
        let result = 0
        let days = this.date.getFullYear() % 4 === 0 ? 366 : 365
        
        size = this.getSize(size) / base

        result = Math.floor(num * size * 10**2 / days)

        return result
    }    

    duration(distance = 10, speed = 1, size = 'hour') {
        let result = this.exchange((distance / speed), 'hour', size)

        return result
    }

    term(num = 10) {
        let value = parseInt(Math.random() * num)
        let period = sizes[Math.floor(Math.random() * sizes.length)]?.title

        return {value, period}
    }

    walking(value = 10, size = 'minute', speed = '*') {
        let result = 0
        let stepsbase = 60

        stepsbase = stepsbase + (speed.length > 3 ? 3 : speed.length) * 20
       
        let steptime = Math.floor(60 / stepsbase * 1e3)

        size = this.getSize(size)
         
        result = Math.floor((value * size) / steptime)

        return result
    }
}

module.exports = Core