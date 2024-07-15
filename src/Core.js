const HelperContainer = require('./Helper')
const {basic_value, weekdays, months, minutesMid, minutesMax, time_start, base, rome_nums, binary_check_items, sizes, monthSize, seasons, day_parts, date_sizes, time_sizes, initial_date_parts, war_date, zodiacSigns, generationWeight, solarSystemPlanets, abc, specs, operations, datePeriods, timePeriods, timePartsBorders, datePartsBorders, timeMeasures, timePosition} = require('./data')

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
  
        result = `${pieces[2]}.${this.rounding(months.findIndex(el => el.includes(pieces[1])) + 1)}.${pieces[3]}`

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

    filterByValue(date = '22.02.2024', period = 'day', value = 22) {
        let result = false
        let parts = this.parts(date, '.', true)

        let index = datePeriods.indexOf(period)

        index = index > 0 ? index : 0

        result = parts[index] === value

        return result
    }

    difference(date, flag = 'day', lock = 1e1) {
        let result = 0
        let origin = this.move()
        let side = this.isWillBe(date) ? '+' : '-'
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
            value = value >= 0 && value <= minutesMax ? value : value % minutesMax

            let h = Math.floor(value / 6e1)
            let m = value % 6e1

            h = value > minutesMid && isTwelve ? Math.floor((value - minutesMid) / 6e1) : h

            result = `${this.rounding(h)}:${this.rounding(m)}`

        } else if ('deconvert') {
            let parts = this.parts(value, ':', true) 
            
            result = parts[0] * 6e1 + parts[1]

            result = result > minutesMid && isTwelve ? result - minutesMid : result
        }

        return result
    }

    times(start = time_start, period = 3e1, num = 1e1) {   
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

    range(dates = [], period = 'day') {
        let indexes = []
        let max = 0
        let min = 1e6

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
        let borders = [(value - 1)*1e1**2 + 1, value*1e1**2]

        return borders
    }

    century(year = 1e3, isRome = false) {
        let num = Math.ceil(year / 1e2)
    
        return isRome ? this.convert(num, 'convert') : num
    }
    
    now(format = 'all', divider = '') {
        let minutes = this.date.getHours() * 6e1 + this.date.getMinutes()
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

    event(time = '12:00', duration = 9e1, utc = 1) {
        let timestamp = this.getUTC(utc)
        let event = this.time(time, 'deconvert') 
        let result = 0

        let difference = Math.abs(timestamp - event)
  
        result = Math.floor(difference / duration)

        return result
    }
    
    palindrom(value = '', isDate = true) {
        let result = true
        let parts = this.parts(value, this.getSymbol(isDate))
 
        result = isDate ?  
                this.reverse(parts[0]) === parts[2] && this.reverse(parts[1]) === parts[1]
            :
                this.reverse(parts[0]) === parts[1]
     
        return result
    }

    binary(value = '', isDate = true) {
        let result = true
        let borders = binary_check_items[Number(isDate)]  
        let parts = this.parts(value, this.getSymbol(isDate))

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

    exchange(num = 1e1, from = 'minute', to = 'hour') {
        let result = 0

        let start = this.getSize(from) * num
        let end = this.getSize(to)

        result = Math.floor(start / end)
    
        return result
    }

    clock(value = 1e1, arrow = 'hour', isPositive = true) {
        const max = 12
        
        let result = 0
        let isMinute = arrow === 'minute'
        let current = isMinute ? value % 6e1 : Math.floor(value / 6e1)

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
            result += 36e1
        }
       
        return result
    }

    formula(start = '12:00', duration = 0, body = 'x + y - 1', size = 'minute') {
        let result = this.time(start, 'deconvert')
        size = this.getSize(size) * duration * minutesMax / base

        body = this.splin(body, 'x', result)
        result = eval(this.splin(body, 'y', size))

        return this.time(result)
    }

    sequence(start = '12:00', interval = 1e1, num = 5, mask = ':30') {
        let result = []
        let initial = this.time(start, 'deconvert')
        let parts = this.parts(mask, ':')
        let index = Math.abs(parts.indexOf('') - 1)

        let maskValue = Math.floor(parts[index])

        for (let i = 1; i <= num; i++) {
            let value = initial + i * interval
            let piece = index === 0 ? Math.floor(value / 6e1) : value % 6e1

            if (piece === maskValue) {
                result = [...result, this.time(value)]
            } 
        }

        return result
    } 

    format(value = '', key = 'default', isDate = true) {
        let result = ''
        let parts = this.parts(value, this.getSymbol(isDate)) 

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
                let prefix = this.percent(count, minutesMax, 0) > 5e1
                let time = prefix ? this.time(count - (minutesMax / 2)) : value
                
                result = `${time} ${prefix ? 'PM' : 'AM'}`
            } else if (key === 'standard') {
                return `${parts[0]} hours ${parts[1]} minutes`
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
        let days = this.getYearSize(this.date.getFullYear())
        
        size = this.getSize(size) / base

        result = Math.floor(num * size * 1e1**2 / days)

        return result
    }    

    duration(distance = 1e1, speed = 1, size = 'hour') {
        let result = this.exchange((distance / speed), 'hour', size)

        return result
    }

    period(num = 1e2) {
        let size = sizes[Math.floor(sizes.length * Math.random())]
        let value = Math.floor(num * Math.random())

        let result = `${value} ${size.title}s`

        return result
    }

    walking(value = 1e1, size = 'minute', speed = '*') {
        const speedlimit = 3
        let result = 0
        let stepsbase = 6e1

        stepsbase = stepsbase + (speed.length > speedlimit ? speedlimit : speed.length) * 2e1
       
        let steptime = Math.floor(6e1 / stepsbase * 1e3)

        size = this.getSize(size)
         
        result = Math.floor((value * size) / steptime)

        return result
    }

    hash(value = '', isDate = true, multiplier = 1) {
        const parts = this.parts(value, this.getSymbol(isDate))

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

    year(difference = 0, isRome = false) {
        let year = this.date.getFullYear()
        let isLeap = false

        if (isRome) {
            year += 753
        } 

        year -= difference

        isLeap = year % 4 === 0

        return {year, isLeap}
    }

    months(length = 12, isTitle = false) {   
        const date = this.parts(this.now('date'), '.', true) 

        let max = date[1]
        let result = new Array(max).fill(null).map((_, idx) => max - idx)

        result = result.slice(0, length)

        if (isTitle) {
            result = result.map(el => months[el - 1])
        }

        return result
    }

    nearest(time = '', arr = [], key = '') {
        let result = null
        let index = 0
        let flag = true

        let value = this.time(time, 'deconvert')
        let difference = value

        if (key !== '') {
            arr = arr.map(el => el[key])
        } 

        flag = arr[0] === undefined || typeof arr[0] === 'object'

        if (flag) {
            return time
        }

        arr.map((el, idx) => {
            let current = this.time(el, 'deconvert')
            let diff = Math.abs(value - current)

            if (current >= value && diff < difference) {
                index = idx
                difference = diff
            }
        })

        result = arr[index]

        return result
    }

    bit(content = '', isDate = false) {
        let result = this.parts(content, this.getSymbol(isDate), true)

        result = result.map(el => {
            let value = el
            let current = ''

            while (value > 0) {
                let piece = value % 2

                if (piece !== 0) {
                    value -= piece
                }

                current += piece
                value /= 2
            }

            return current
        })

        result = result.map(el => this.reverse(el))

        return result
    }

    pomodoro(time = '', num = 1, duration = 25, pause = 5, rest = 15) {
        let result = []
        let sum = duration + pause
        let start = this.time(time !== '' ? time : this.now('time'), 'deconvert')

        for (let i = 0; i < num; i++) {
            let index = i + 1   
            let checked = index % 4 === 0

            result = [...result, this.time(start)]

            start += checked ? sum + rest : sum 
        }

        return result
    }

    info(text = '', isDate = true) {
        let result = {}
        let parts = this.parts(text, this.getSymbol(isDate), true) 

        if (isDate) {

            let seasonFlag = parts[1] + 1 < seasons.length
            let seasonIdx = seasonFlag ? 0 : Math.floor(parts[1] / seasons.length) + 1

            let century = Math.ceil(parts[2] / 1e2) 
            let month = months[parts[1] - 1]
            let season = seasons[seasonIdx] === undefined ? seasons[0] : seasons[seasonIdx]
            let decade = Math.floor(parts[0] / 1e1)
            let isLeap = parts[2] % 4 === 0
            let percent = Math.floor(((parts[1] - 1) * monthSize + parts[0]) / (isLeap ? 366 : 365) * 1e2)

            result = {...result, century, month, season, decade, percent, isLeap}

        } else {

            let minutes = this.time(text, 'deconvert')
            let residue = minutes % 6e1
            let part = day_parts.find(el => minutes <= el.border)?.title
            let isHalf = minutes >= minutesMid

            result = {...result, minutes, residue, part, isHalf}
        }

        return result
    }

    us(content = '', isDate = true, isRange = false) {
        let result = content

        if (isDate) {
            let parts = this.parts(content, '.', true)

            result = [...parts.reverse().slice(1), parts[0]].join('.')
        } else {
            let value = this.time(result, 'deconvert')
            let checked = Boolean(Math.floor(value / minutesMid))
            let method = isRange ? 'ceil' : 'floor'

            result = Math[method]((checked ? value - minutesMid : value) / 6e1) + ' ' + (checked ? 'pm' : 'am')
        }

        return result
    }

    isWillBe(date = '24.08.2024') {
        let nums = [this.now('date'), date].map(el => this.getDateNum(el))
        
        return nums[0] <= nums[1]
    }

    num(digit = 1) {
        let text = String(this.value)
        let part = text.split('').reverse().slice(0, 3).join('')
        let result = 0
    
        part = Number(part)
        digit = digit < text.length ? digit : text.length - 1
   
        result = part * Number(text[digit])

        return result
    }

    reading(text = '', isNum = true) {
        let words = text.split(' ').length
        let result = Math.floor(words / 14e1)

        return isNum ? result : this.time(result)
    }

    cat(date = '', max = 1e2) {
        let age = this.difference(date, '-', 1e7) / 365
        let result = 12 + (age - 2) * 4

        result = Math.floor(result / 1e2 * max)

        return result
    }

    war(size = 'day') {
        let days = this.difference(war_date, '-', 1e7)
        let result = 0

        size = this.getSize(size) / base
        result = Math.floor(days / size)
        
        return result
    }

    zodiac(date = '') {
        let year = this.parts(date, '.', true)[2]
        let difference = Math.abs(year - 19e2)
        let index = difference % months.length
        let result = ''

        result = zodiacSigns[index]

        return result
    }

    func(time = '12:30', body = '', marker = 'x') {
        let parts = this.parts(time, ':', true)
        let value = eval(this.splin(body, marker, parts[0]))
        let result = value === parts[1]

        return result
    }

    isWeekend() {
        let index = this.date.getDay()
        let result = (weekdays.length - index) < Math.floor(weekdays.length / 3) 

        return result
    }

    replace(content = '', isDate = true) {
        let parts = this.parts(content, this.getSymbol(isDate))
        let result = ''
        
        parts.map(el => {
            let middle = Math.floor(el.length / 2)
            let first = el.slice(0, middle)
            let second = el.slice(middle)
    
            result += second + first + this.getSymbol(isDate)
        })
        
        result = result.slice(0, result.length - 1)

        return result
    }

    late(time = '12:30', deadline = '12:30', duration = 0) {
        let difference = this.time(this.timeDistance(time, deadline), 'deconvert') 
        let result = Math.floor((difference / duration) * 1e2)

        return result
    }

    circle(radius = 1, speed = 1, isMeters = false) {
        let distance = radius * 2e-3 * Math.PI * 6e1
        let result = 0

        if (isMeters) {
            speed *= 3.6
        }

        result = this.time(Math.floor(distance / speed))

        return result
    }

    generation(age = 18, num = 5) {
        let year = this.parts(this.now('date'), '.', true)[2]
        let result = Math.floor(year - (age + generationWeight * num))

        return result
    }

    space(num = 1, size = 'day', title = 'Earth') {
        const planet = solarSystemPlanets.find(el => el.name === title)
        let result = num

        if (planet !== undefined) {
            let value = this.getSize(size)

            result = Math.floor(planet.dayDuration * num * value / base)
        }

        return result
    }

    encode(content = '', isDate = true, formula = '(x + 1) / 2', marker = 'x') {
        let parts = this.parts(content, this.getSymbol(isDate))
        let sum = 0
        let result = ''

        parts.map((el, idx) => {
            let nums = el.split('')
            let counter = 0
            
            nums.map(elem => {
                const num = Number(elem)
                let index = num + idx + 1
           
                let letter = abc[index]

                counter += num
                result += index % 2 ? letter.toUpperCase() : letter
            })

            let number = Math.abs(eval(this.splin(formula, marker, Math.floor(counter / nums.length))))

            result += number
            sum += number
        })

        result += specs[sum % specs.length]
    
        return result
    }

    rate(time = '12:30', cost = 1, round = 1) {
        let difference = this.time(this.timeDistance(this.now('time'), time), 'deconvert')
        let result = 0 
    
        if (start <= end) {
            result = this.toRound(difference / 6e1 * cost, round)
        }
    
        return result
    }
    
    vacation(days = 0) {
        let max = this.getYearSize(this.date.getFullYear())
        let period = Math.floor(max / days)
        let results = []
    
        for (let i = 0; i < days; i++) {
            let date = this.move('day', '+', period * i)
    
            results = [...results, date]
        }
    
        return {days: results, period}
    }
     
    endOfMonth(date = '') { 
        let parts = this.parts(date, '.', true)
        let result = this.getMonthSize(parts[1], parts[2]) - parts[0]

        return result
    }

    capital(num = 1, period = 'day', rate = 1) {
        let size = this.getSize(period)
        let result = Math.floor(num * rate * size * 24 / base)

        return result
    }

    deviation(step = 6e2, round = 0) {
        let border = this.time(this.now('time'), 'deconvert')
        let piece = border % step
        let difference = this.percent(piece, step, round)
        let result = border < step ? 1e2 - difference : difference
       
        return result
    }

    filterBySchema(content = '', isDate = true, schema = '', index = 0) {
        let parts = this.parts(content, this.getSymbol(isDate), true)
        let result = true

        if (schema.length === 0 | parts.length === 1) {
            return result
        }

        let code = this.splin(schema, 'x', parts[index])

        result = eval(code)

        return result
    }

    similarity(content = '', isDate = true, mask = '') {
        let result = 0

        if (content.length === 0 | mask === '') {
            return result
        }
        
        let initialParts = this.parts(content, this.getSymbol(isDate)).map(el => el.split('')).flat(1)
        let amount = Math.floor(1e2 / initialParts.length)
        let index = 0

        mask.split(this.getSymbol(isDate)).map((el) => {
            el.split('').map((part) => {
                if (initialParts[index] === part) {
                    result += amount
                }

                index++
            })
        })

        return result
    }

    interval(time = 1, code = '', callStack = 1e3) {
        let counter = 1

        if (code === '') {
            return 0
        }
        
        const ref = setInterval(() => {
            eval(code)
            
            if (counter === callStack) {
                clearInterval(ref)
            }  

            counter++
        }, time * 1e3)           
    }

    timeout(delay = 0, code = '') {
        if (code.length === 0) {
            return 0
        }

        setTimeout(() => {  
            eval(code)
        }, delay * 1e3)
    }

    matrix(time = '', size = 1, step = 0, delay = 3e1) {
        let result = []

        if (time.length === 0) {
            return result
        }

        let start = this.time(time, 'deconvert')
        let value

        new Array(size).fill(null).map((_, idx) => {
            let times = []

            for (let i = 0; i < size; i++) {
                value = start + idx * delay + i * step

                let time = this.time(value)

                times = [...times, time]               
            }

            result = [...result, times]
        })

        return result
    }

    percentage(time = '', round = 0) {
        let result = []
        
        if (time.length === 0) {
            return result
        }
        
        let value = this.time(time, 'deconvert')
        let hours = this.percent(Math.floor(value / 6e1), 24, round)
        let minutes = this.percent(Math.floor(value % 6e1), 6e1, round)
        let all = this.percent(value, minutesMid * 2, round)
    
        result = [all, hours, minutes]

        return result
    }

    dateDistance(start = '', end = '', size = 'day') {
        if (start.length === 0 | end === '') {
            return ''
        }

        let result = 0 

        let firstParts = this.parts(start, '.', true)
        let secondParts = this.parts(end, '.', true)

        let firstValue = 0
        let secondValue = 0

        let isForward = true

        date_sizes.map((el, idx) => {
            firstValue += el * firstParts[idx]
            secondValue += el * secondParts[idx]
        })

        isForward = firstValue <= secondValue

        let differences = date_sizes.map((el, idx) => Math.abs(firstParts[idx] - secondParts[idx]) * el)
        
        result = differences[2] 

        let isMonthLess = firstParts[1] < secondParts[1]
        let isDaysLess = firstParts[0] < secondParts[0]

        let monthOperationResult = (flag) => flag && isForward ? result + differences[1] : result - differences[1]
        let daysOperationResult = (flag) => flag && isForward ? differences[0] : date_sizes[0] - differences[0]

        result = monthOperationResult(isMonthLess)
        result += daysOperationResult(isDaysLess) 
      
        result = Math.ceil(Math.abs(result * base / this.getSize(size)))

        return result
    }

    isEven(content = '', isDate = true) {
        let items = []
        let GCD = 0
        
        if (content.length === 0) {
            return {items, GCD}
        }

        let parts = this.parts(content, this.getSymbol(isDate), true)

        parts.map((el, idx) => {
            let current = el
            let next = parts[idx + 1]
            
            // euclidean algorithm

            while (current && next && current !== next) {
                [current, next] = current > next ? [current - next, next] : [current, next - current]
            }

            if (next) {
                GCD = current
            }
          
            items = [...items, el % 2 === 0]
        })

        return {items, GCD}
    }

    isTime(content) {
        let result = typeof content === 'string'

        if (result === true) {
            let parts = this.parts(content, ':', true) 

            result = parts.length === 2

            parts.map((el, idx) => {
                let border = timePartsBorders[idx]

                if (result === true) {
                    result = el <= border && el >= 0
                }
            })
        }

        return result
    }

    timestamp(date = '', time = '') {
        if (date === '') {
            return 0 
        }

        let parts = this.parts(date, '.', true)
        let result = 0

        date_sizes.map((el, idx) => {
            result += Math.floor(Math.abs(parts[idx] - initial_date_parts[idx]) * el)
        })

        result *= base

        let flag = this.isTime(time)
        
        if (flag === true) {
            parts = this.parts(time, ':', true)
        
            time_sizes.map((el, idx) => {
                result += el * parts[idx] * 1e3
            })
        }

        return result
    }

    activity(timestamps = [], percent = 0) {
        let result = 0

        for (let i = 0; i < timestamps.length - 1; i++) {        
            let difference = this.time(this.timeDistance(timestamps[i], timestamps[i + 1]), 'deconvert')
        
            result += Math.floor(percent * difference / 1e2)
        }

        return result
    }

    age(birthdate = '') {
        let result = 0

        if (birthdate === '') {
            return result
        }    

        let from = this.parts(this.now('date'), '.', true)
        let to = this.parts(birthdate, '.', true)

        result = Math.abs(from[2] - to[2])

        if (from[1] < to[1]) {
            result--
        }

        if (from[1] === to[1]) {
            result = from[0] >= to[0] ? result : result - 1
        }

        return result
    }

    deadlineOfMonth(date = '02.12.1805', percent = 5e2, round = 0) {
        let parts = this.parts(date, '.', true)
        let size = this.getMonthSize(parts[1], parts[2])
        let result = parts[0] + this.cleanValue(percent, size, round)

        return result
    }    

    generator(numbers = [], isDate = true) {
        let sum = numbers.reduce((acc, cur) => acc + cur)
        let borders = isDate ? datePartsBorders : timePartsBorders
        let result = []

        numbers.map((el, idx) => {
            let percent = this.percent(el, sum, 0)
            let value = this.cleanValue(percent, borders[idx], 0)
            
            result = [...result, value] 
        })

        result = result.join(this.getSymbol(isDate))

        return result
    }

    percentOfMonth(date = '', num = 1, period = 'day', round = 0) {
        let parts = this.parts(date, '.', true)
        let size = this.getMonthSize(parts[1], parts[2])
        let weight = Math.floor(this.getSize(period) * num / base)
        let result = 0

        size -= parts[0]
    
        result = this.percent(weight, size, round)

        return result
    }

    capacity(date = '') {
        let parts = this.parts(date, '.', true)
        let leep = Math.floor(parts[2] / 4)
        let all = leep * 366 + (parts[2] - leep) * 365 
        let value = parts[1] * monthSize + parts[0]
        let result = Math.floor(all / value)

        return result
    }

    change(content = '', period = 'month', num = 12, isDate = true) {
        let parts = this.parts(content, this.getSymbol(isDate), true)
        let result = ''

        if (parts.length === 1) {
            return result
        }

        let borders = isDate ? datePartsBorders : timePartsBorders
        let periods = isDate ? datePeriods : timePeriods
        let index = periods.indexOf(period)

        index = index !== -1 ? index : 0

        let border = borders[index]
        let flag = Math.abs(num) <= border

        if (flag === true) {
            result = [...parts.slice(0, index), num, parts.slice(index + 1)].flat(1)

            result = result.map(el => this.rounding(el)).join(this.getSymbol(isDate))
        }

        return result
    }

    id(content = '', isDate = true) {
        let parts = this.parts(content, this.getSymbol(isDate), true)
        let result = ''

        parts.map((el, idx) => {
            let operation = operations[Math.floor(operations.length * Math.random())]
            let value = Math.floor(eval(`${el}${operation}${idx + 1}`))
            let index = value >= specs.length ? value % specs.length : value
        
            result += specs[index]
        })

        return result
    }   

    fromArray(arr = []) {
        let result = []

        arr.map((_, idx) => {
            if (idx < arr.length - 2) {
                let items = []
               
                datePartsBorders.map((border, i) => {
                    let value = Math.abs(arr[idx + i])

                    if (value <= border) {
                        items = [...items, value]
                    }
                })

                if (items.length === datePartsBorders.length) {
                    result = [...result, items.map(el => this.rounding(el)).join('.')]
                }
            }
        })

        return result
    }

    yearResidue(percent = 0) {
        const parts = this.parts(this.now('date'), '.', true)
        const yearSize = this.getYearSize(parts[2])

        let allDays = (parts[1] - 1) * monthSize + parts[0]
        let days = this.cleanValue(percent, (yearSize - allDays), 0)
        let result = this.move('day', '+', days)

        return result
    }

    summer(date = '', round = 0) {
        const due = 92
        let result = 0

        if (this.isDate(date)) {
            let parts = this.parts(date, '.', true)
            
            result = this.percent(this.distance(`01.06.${parts[2]}`, date), due, round)
        }

        return result
    }

    cigarette(time = '', num = 1e1, round = 0) {
        let difference = this.time(this.timeDistance(this.now('time'), time), 'deconvert')
        let result = this.toRound(difference / num, round)

        return result
    }

    timeRound(time = '', num = 5) {
        let value = this.time(time, 'deconvert')
        let piece = value % 6e1
        let difference = Math.abs(piece - num)

        let result = piece < num ? this.time(value + difference) : this.time(value - difference)

        return result
    }

    monthDayBorder(date = '', num = 1e1) {
        let parts = this.parts(date, '.', true)
        let size = this.getMonthSize(parts[1], parts[2])
        let result = parts[0] >= num && parts[0] <= size - num

        return result
    }

    timeByPercent(num = 1e1, round = 0) {
        let value = this.cleanValue(num, minutesMax, round)
        let result = this.time(Math.floor(value))

        return result
    }

    timeByFibonacci(num = 7) {
        let current = 0
        let next = 1
        let result = ''       

        for (let i = 0; i < num; i++) {
            let temp = next

            next = current + next
            current = temp
        }   

        result = this.time(current)

        return result
    }

    dateByPercent(percent = 1e1, num = 1e3, round = 0) {
        let size = this.getYearSize(num)
        let value = this.cleanValue(percent, size, round)
        let index = 1
        let flag = true
        let result = ''

        while (flag === true) {
            let monthTerm = this.getMonthSize(index, num)

            if (value >= monthTerm) {
                value -= monthTerm
                index++
            } else {
                flag = false
            }
        }

        result = `${Math.floor(value)}.${index}.${num}`
        result = result.split('.').map(el => this.rounding(el)).join('.')

        return result
    }

    timeByNumeralSystem(num = 1e1, system = 2) {
        let arr = this.parts(String(num), '', true)
        let value = arr.reduce((acc, el, idx) => acc + (el * system**idx))
        let result = this.time(value)
    
        return result
    }

    quarter(time = '') {
        let size = this.time(time, 'deconvert') % 6e1
        let quarterNumber = Math.ceil(size / 15)
        let nearestQuarterSize = size % 15
        let percent = this.percent(size, 6e1, 0)

        return {
            quarterNumber, 
            nearestQuarterSize,
            percent
        }
    }

    schedule(days = [], times = [], num = 1) {
        let gap = days.length !== 0 ? this.gap(days[0], 'tag') : 0
        let length = Math.min(days.length, times.length)
        let indexes = days.slice(0, length).map(el => weekdays.findIndex(weekday => weekday.tag === el))
        let result = []

        for (let i = 0; i < num; i++) {
            indexes.map((el, idx) => {
                let date = this.move('day', '+', i * 7 + el + gap - 1)

                result = [...result, `${times[idx]} ${date}`]
            })
        }

        return result
    }
}

module.exports = Core