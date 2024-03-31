const HelperContainer = require('./Helper')
const {basic_value, weekdays, months, minutesMid, minutesMax, time_start, base, rome_nums, binary_check_items, sizes, monthSize, seasons, periods, day_parts} = require('./data')

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

    filter(date = '22.02.2024', period = 'day', value = 22) {
        let result = false
        let parts = this.parts(date, '.', true)

        let index = periods.indexOf(period)

        index = index > 0 ? index : 0

        result = parts[index] === value

        return result
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
            let parts = this.parts(value, ':', true) 
            
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
        let timestamp = this.getUTC(utc)
        let border = this.time(time, 'deconvert')
        let result = 0
        let isGone = border < timestamp

        result = Math.abs(border - timestamp)

        result = isNum ? this.time(result) : `${isGone ? 'Passed' : 'Pass in'} ${result} minutes`
    
        return {
            result,
            isGone
        }
    }

    event(time = '12:00', duration = 90, utc = 1) {
        let timestamp = this.getUTC(utc)
        let event = this.time(time, 'deconvert') 
        let result = 0

        let difference = Math.abs(timestamp - event)
  
        result = Math.floor(difference / duration)

        return result
    }
    
    palindrom(value = '', isDate = true) {
        let result = true
        let parts = this.parts(value, isDate ? '.' : ':')
 
        result = isDate ?  
                this.reverse(parts[0]) === parts[2] && this.reverse(parts[1]) === parts[1]
            :
                this.reverse(parts[0]) === parts[1]
     
        return result
    }

    binary(value = '', isDate = true) {
        let result = true
        let borders = binary_check_items[Number(isDate)]  
        let parts = this.parts(value, isDate ? '.' : ':')

        borders.map((el, idx) => {
            let counter = 1
            let part = Number(parts[idx])
            let flag = false

            while (counter <= el && !flag) {
                let current = 2**counter
           
                flag = current === part

                counter++
            }

            result = flag
        })

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

    sequence(start = '12:00', interval = 10, num = 5, mask = ':30') {
        let result = []
        let initial = this.time(start, 'deconvert')
        let parts = this.parts(mask, ':')
        let index = Math.abs(parts.indexOf('') - 1)

        let maskValue = Math.floor(parts[index])

        for (let i = 1; i <= num; i++) {
            let value = initial + i * interval
            let piece = index === 0 ? Math.floor(value / 60) : value % 60

            if (piece === maskValue) {
                result = [...result, this.time(value)]
            } 
        }

        return result
    } 

    format(value = '', key = 'default', isDate = true) {
        let result = ''
        let parts = this.parts(value, isDate ? '.' : ':') 

        if (key === 'default') {
            return value
        }

        if (isDate) {
            if (key === 'letter') {
                result = `${months[parts[1] - 1]} ${parts[0]}, ${parts[2]}`
            } else if (key === 'year') {
                result = parts[1] > 6 ? parts[2] + 1 : parts[2]
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

    pointer(text = 'today') {
        let result = ''
        let arrow = '+'
        let days = 0

        if (text === 'tomorrow') {
            arrow = '+'
            days = 1
        } else if (text === 'yesterday') {
            arrow = '-'
            days = 1
        }

        result = this.move('day', arrow, days)

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
        const speedlimit = 3
        let result = 0
        let stepsbase = 60

        stepsbase = stepsbase + (speed.length > speedlimit ? speedlimit : speed.length) * 20
       
        let steptime = Math.floor(60 / stepsbase * 1e3)

        size = this.getSize(size)
         
        result = Math.floor((value * size) / steptime)

        return result
    }

    timus(birthdate = '02.12.2004') {
        const monthmax = 6
        let parts = this.parts(birthdate, '.', true)
        let year = parts[2]
        let result = 0 
        let quotient = 1

        for (let i = 2; i < 10; i++) {
            let value = year / i

            if (value % 1 === 0 && i > quotient) {
                quotient = i
            }
        } 

        result += parts[2] / quotient

        result += monthmax - Math.abs(monthmax - parts[1])   
        
        result += parts[0]

        return result
    }

    hash(value = '', isDate = true, multiplier = 1) {
        const parts = this.parts(value, isDate ? '.' : ':')

        let result = 0
        let i = 0

        parts.map((text, idx) => {
            let power = idx + multiplier

            for (i; i < text.length; i++) {
                let current = Number(text[i])
                
                result += current % 2 === 0 ? current**power : current
            }

            i = 0
        })

        return result
    }

    context(date = '24.02.2022') {
        const parts = this.parts(date, '.', true)

        let percent = 0
        let season = ''
    
        let index = Math.floor(parts[1] / 3)

        percent = Math.floor((((parts[1] - 1) * monthSize + parts[0]) / 365) * 100)
        season = (index === 0 || parts[1] === 12) ? seasons[0] : seasons[index]

        return {season, percent}
    }

    year(difference = 0) {
        let year = this.date.getFullYear()
        let isLeap = false

        year -= difference

        isLeap = year % 4 === 0

        return {year, isLeap}
    }

    months(length = 12, isTitle = false) {   
        const date = this.parts(this.timestamp('date'), '.', true) 

        let max = date[1]
        let result = new Array(max).fill(null).map((_, idx) => max - idx)

        result = result.slice(0, length)

        if (isTitle) {
            result = result.map(el => months[el - 1])
        }

        return result
    }

    daypart(time = '12:00') {
        let minutes = this.time(time, 'deconvert')
        let result = day_parts.find(el => minutes <= el.border)?.title

        return result
    }
}

module.exports = Core