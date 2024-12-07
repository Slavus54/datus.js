const HelperContainer = require('./Helper')
const {basic_value, weekdays, months, minutesMid, minutesMax, time_start, base, rome_nums, binary_check_items, sizes, monthSize, seasons, day_parts, date_sizes, time_sizes, initial_date_parts, zodiacSigns, solarSystemPlanets, abc, specs, operations, datePeriods, timePeriods, timePartsBorders, datePartsBorders, timeMeasures, timePosition, msDividers, timePartsLimits} = require('./data')

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
            } 
            
            if (min > value) {
                min = value
            }
        }

        return Math.abs(max - min)
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
                result = `${months[parts[1] - 1]} ${parts[0]}th, ${parts[2]}`
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
        let nums = [this.now('date'), date].map(el => this.dateValue(el))
        
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

    generation(min = 2e1, max = 3e1, num = 5) {
        let result = this.date.getFullYear()

        for (let i = 0; i < num; i++) {
            let value = this.getIntervalValue([min, max])

            result -= value
        }

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

    filterPartBySchema(content = '', isDate = true, schema = '', index = 0) {
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
        let result = 0 

        if (start.length === 0 | end === '') {
            return result
        }

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

    deadlineOfMonth(date = '02.12.1805', percent = 5e1, round = 0) {
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
            
            result = this.percent(this.dateDistance(`01.06.${parts[2]}`, date), due, round)
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

    timeByPercent(num = 1e1, max = minutesMax, round = 0) {
        let value = this.cleanValue(num, max, round)
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

    yearsByFormula(formula = '', length = 1e1, marker = 'x') {
        let text = formula.split('')
        let result = []

        for (let i = 0; i < length; i++) {
            let value = ''

            text.map(el => {
                if (el === marker) {
                    value += this.getIntervalValue([0, 9])
                } else {
                    value += el
                }
            })

            result = [...result, Number(value)]
        }

        result = Array.from(new Set(result))

        return result
    }

    yearsByInterval(num = 1, step = 1, border = this.date.getFullYear(), isIncrease = true) {
        let result = []

        for (let i = 0; i < num; i++) {
            result = [...result, border]

            border = isIncrease ? border + step : border - step           
        }

        return result
    }

    weekdayByDate(date = '') {
        let parts = this.isDate(date) ? this.parts(date, '.', true) : null
        let result = ''

        if (parts) {
            let leep = Math.floor(parts[2] / 4)
            let days = leep * 366 + (parts[2] - leep) * 365 
       
            days -= Math.abs(this.getMonthSize(parts[1]) - parts[0]) 
           
            months.slice(parts[1], months.length).map((_, idx) => {
                let size = this.getMonthSize(parts[1] + idx + 1)
                
                days -= size
            })

            days -= 2

            result = weekdays[Math.floor(days % weekdays.length)].title
        }

        return result
    }

    yearsByCentury(century = 21, decade = 1) {
        let result = []
        let value = (century - 1)*1e2 + (decade - 1)*1e1

        for (let i = 0; i < 1e1; i++) {
            result = [...result, value]
            value++
        }

        return result
    }

    isNight(time = '') {
        let size = this.time(time, 'deconvert') || 0
        let result = 0 <= size && size <= 36e1

        return result
    }

    randomDates(num = 1, border = 1e1, isPassed = true) {
        let result = []
    
        for (let i = 0; i < num; i++) {
            let date = this.move('day', isPassed ? '+' : '-', Math.floor(Math.random() * border))

            result = [...result, date]
        }

        return result
    }

    randomTimes(num = 1, min = 0, max = minutesMax) {
        let result = []

        for (let i = 0; i < num; i++) {
            let value = Math.floor(Math.random() * max)
            
            while (value < min || value > max) {
                value = Math.floor(Math.random() * max)
            }

            let time = this.time(value)
            
            result = [...result, time]
        }

        return result
    }

    track(timestamps = [], speed = 7e1, round = 0) {
        let time = 0
        let distance = 0

        timestamps.map((el, idx) => {
            if ((idx + 1) % 2 === 0) {            
                time += this.time(this.timeDistance(el, timestamps[idx - 1]), 'deconvert')
            }
        })

        distance = this.toRound(time * speed / 6e1, round)
        time = this.time(time)

        return {time, distance}
    }

    timeDistance(start = '', end = '') {
        let key = 'deconvert'
        let result = ''

        if (this.isTime(start) && this.isTime(end)) {
            result = this.time(Math.abs(this.time(start, key) - this.time(end, key)))
        }

        return result
    }

    monthAllocation(title = '', num = 0, year = 2024) {
        let index = months.indexOf(title) + 1 || 0
        let size = this.getMonthSize(index, year)
        let step = Math.floor(size / num)
        let result = []
        let day = Math.floor(Math.random() * step)

        while (day < size) {
            result = [...result, `${this.rounding(day)}.${this.rounding(index)}.${year}`]
            
            day += step
        }

        return result
    }

    timeAllocation(start = '07:00', end = '23:59', num = 1, isIncludeEndBorder = false) {
        let distance = this.time(this.timeDistance(start, end), 'deconvert')
        let step = Math.floor(distance / num)
        let counter = this.time(start, 'deconvert')
        let result = []

        if (isIncludeEndBorder) {
            counter += step
        }

        for (let i = 0; i < num; i++) {
            result = [...result, this.time(counter)]
            
            counter += step
        }

        return result
    }

    isUniq(content = '', isDate = true) {
        let parts = this.parts(content, this.getSymbol(isDate), true)
        let result = Array.from(new Set(parts)).length === parts.length

        return result
    }

    wheel(size = 29, time = '00:15', speed = 2e1) {
        let result = Math.floor(this.time(time, 'deconvert') * speed * 1e3 / (6e1 * Math.PI * size / 4e1))

        return result
    }

    decadesMonthAllocation(days = [], title = '', year = 2024) {
        let index = months.indexOf(title) + 1 || 0
        let border = this.getMonthSize(index, year)
        let counter = 0
        let result = []

        days.map((el, idx) => {
            let size = (idx + 1) * 1e1
            let isFullDecade = size <= border
            let step = Math.floor((isFullDecade ? 1e1 : border - size) / el)
         
            for (let i = 0; i < el; i++) {
                counter += step

                result = [...result, `${this.rounding(counter)}.${this.rounding(index)}.${year}`]
            }
        })

        return result
    }

    isDate(content = '') {
        let result = content.split('.').length === 3

        if (result) {
            let parts = this.parts(content, '.', true)
            let monthSize = this.getMonthSize(parts[1])

            result = parts[0] <= monthSize && parts[1] <= 12 
            result = parts.filter(el => el > 0).length === parts.length
        }

        return result
    }

    dateValue(date = '') {
        let result = 0

        if (this.isDate(date)) {
            let parts = this.parts(date, '.', true)

            months.slice(0, parts[1] - 1).map((_, idx) => {
                let size = this.getMonthSize(idx + 1, parts[2])
                
                result += size
            })

            result += parts[0]
        }

        return result
    }

    timeByNumbersOperations(base = 1e3, numbers = []) {
        let actions = operations.slice(0, 2)
        let value = base
        let result = ''

        numbers.map(el => {
            let action = actions[Math.floor(Math.random() * actions.length)]

            value = eval(`${value}${action}${el}`)
        })

        result = this.time(value)

        return result
    }

    timeByDeviation(base = 6e2, percent = 1e1, isTopBorder = true) {
        let size = this.cleanValue(percent, base, 0)
        let value = Math.floor(Math.random() * size)
        let result = this.time(isTopBorder ? base + value : base - value)

        return result
    }

    timestampsByPercent(border = 6e2, list = [], isUniq = false) {
        let now = this.time(this.now('time'), 'deconvert')
        let size = Math.abs(now - border) 
        let result = []

        list.map(el => {
            let value = now + this.cleanValue(el, size, 0)

            result = [...result, this.time(value)]
        })

        if (isUniq) {
            result = Array.from(new Set(result))
        }

        return result
    }

    monthWeekdays(weekday = '') {
        let parts = this.parts(this.now('date'), '.', true)
        let gap = this.gap(weekday) 
        let size = this.getMonthSize(parts[1])
        let result = Math.floor((size - parts[0] - gap) / weekdays.length) + 1   

        return result
    }

    timeMove(num = 0, isForward = true) {
        let symbol = isForward ? '+' : '-'
        let value = eval(`${this.time(this.now('time'), 'deconvert')}${symbol}${num}`)
        let result = this.time(value)

        return result
    }

    bySchema(schema = '', isDate = true, marker = 'x') {
        let result

        while (isDate ? !this.isDate(result) : !this.isTime(result)) {
            result = schema.split('').map(el => el === marker ? this.getIntervalValue([0, 9]) : el).join('')
        }

        return result
    }

    timeByText(content = '') {
        let value = 0
        let result = ''

        if (typeof content === 'string') {
            content.split(' ').forEach((period) => {
                let num = ''
                let measure = ''

                period.split('').map(el => {
                    if (isNaN(el)) {
                        measure += el
                    } else {
                        num += el
                    }
                })

                num = Number(num)
   
                let size = timeMeasures.find(el => el.content === measure)?.value

                value += size * num
            })
        }

        value = Math.floor(value / 6e4) 
        result = this.time(value)

        return result
    }

    timesSortedBy(arr = [], criterion = 'all', isIncreased = true) {
        for (let i = 1; i < arr.length; i++) {
            let current = arr[i]
            let j = i - 1
            
            let currentValue = this.time(current, 'deconvert')
            let previousValue = this.time(arr[j], 'deconvert')
           
            if (criterion === 'hour') {
                currentValue /= 6e1
                previousValue /= 6e1
            } else if (criterion === 'minute') {
                currentValue %= 6e1
                previousValue %= 6e1
            }
            
            while (j >= 0 && isIncreased ? previousValue > currentValue : previousValue < currentValue) {
                arr[j + 1] = arr[j]
                j--
            }
     
            arr[j + 1] = current
        }

        return arr
    }

    dateByParameters(dayBorders = [], monthBorders = [], century = 21, decade = 1) {
        let result = ''

        while (!this.isDate(result)) {
            let day = Math.floor(dayBorders[0] + Math.random() * (dayBorders[1] + 1 - dayBorders[0]))
            let month = Math.floor(monthBorders[0] + Math.random() * (monthBorders[1] + 1 - monthBorders[0]))
            let year = (century - 1)*1e2 + (decade - 1)*1e1 + Math.floor(Math.random() * 1e1)

            result = `${this.rounding(day)}.${this.rounding(month)}.${year}`
        }

        return result
    }

    timesByDigits(numbers = []) {
        let parts = Math.ceil(numbers.length / timePosition)
        let result = []      
        let periods = []
        let idx = 0

        for (let k = 0; k < parts; k++) {
            for (let i = idx; i <= idx + 1; i++) {
                for (let j = idx; j <= idx + 1; j++) {
                    
                    periods = [...periods, `${numbers[i]}${numbers[j]}`] 
                }
            }
          
            idx++
        }            
        
        periods.map((first) => {
            periods.map((second) => {
                let time = `${this.rounding(first)}:${this.rounding(second)}`

                if (this.isTime(time)) {
                    result = [...result, time]
                }
            })
        })

        result = Array.from(new Set(result))

        return result
    }

    match(first = '', second = '', controllers = [], isDate = true) {
        let firstParts = this.parts(first, this.getSymbol(isDate), true)
        let secondParts = this.parts(second, this.getSymbol(isDate), true)
        let result = []

        controllers.map((el, idx) => {
            let value = el === '>' ? Math.max(firstParts[idx], secondParts[idx]) : Math.min(firstParts[idx], secondParts[idx])
        
            result = [...result, this.rounding(value)]
        })

        result = result.join(this.getSymbol(isDate))
    
        return result
    }

    curryTime(hours = 1) {
        return (minutes = 0) => {
            let result = `${this.rounding(hours)}:${this.rounding(minutes)}`

            return this.isTime(result) ? result : ''
        }
    }

    update(content = '', schema = '', indexes = [], operation = '', isDate = true) {
        let parts = this.parts(content, this.getSymbol(isDate), true)
        let result = []

        parts.map((el, idx) => {
            let isUpdated = indexes.indexOf(idx) !== -1

            if (isUpdated) {
                let check = eval(`${el}${schema}`)

                if (check) {
                    el = eval(`${el} ${operation}`)
                } 
            }

            result = [...result, this.rounding(el)]
        })

        result = result.join(this.getSymbol(isDate))

        return result
    }    

    timeByFormula(formula = '', value = 1, base = 0, marker = 'x') {
        let result = this.time(base + eval(this.splin(formula, marker, value)))

        return result
    }

    timestampsByProgression(operations = [], length = 1, base = 6e2) {
        let value = base
        let result = []

        for (let i = 0; i < length; i++) {
            let index = i % operations.length
            
            value = eval(`${value}${operations[index]}`)
            result = [...result, this.time(value)]            
        }

        return result
    }

    exchangePeriod(items = [], indexes = [], isDate = true) {
        let symbol = this.getSymbol(isDate)
        let parts = []
        let result = []

        items = items.map(el => this.parts(el, symbol, true))
        
        items.forEach((item, idx) => {
            item.map((part, i) => {
                let position = Number(idx !== 1)
                let value = indexes[idx] === i ? items[position][indexes[position]] : part

                parts = [...parts, this.rounding(value)]
            })

            result = [...result, parts.join(symbol)]
            parts = []
        })

        return result
    }

    timeByMultiplication(base = 6e2, percent = 1, iterations = 1) {
        let step = 1 + (percent / 1e2)
        let result = ''

        for (let i = 0; i < iterations; i++) {
            base *= step
        }

        result = this.time(Math.floor(base))

        return result
    }

    timeByParameters(hours = [], minutes = []) {
        let result = ''
        let value = hours.length === 1 ? hours[0] : this.getIntervalValue(hours)

        value *= 6e1

        value += minutes.length === 1 ? minutes[0] : this.getIntervalValue(minutes)
    
        result = this.time(value)

        return result
    }   

    weekdaysDifferenceByWeek(start = '', end = '', weeks = 0) {
        let first = 0
        let second = 0
        let result = 0

        weekdays.map((el, idx) => {
            if (el.tag === start) {
                first = idx
            } else if (el.tag === end) {
                second = idx
            }
        })

        result = Math.abs(second - first)
      
        if (second < first) {
            if (weeks > 0) {
                result = Math.abs(weekdays.length - result)
                weeks--
            } else {
                result = 0
            }
        } 

        if (weeks > 0) {
            result += weeks * weekdays.length
        }

        return result
    }

    everydaySpending(base = 1e1, age = 8e1, round = 0) {
        let percent = this.percent(base, minutesMax, round)
        let result = this.cleanValue(percent, age, round)

        return result
    }   

    timestampsByRandomlyStep(base = 6e2, step = 1e2, num = 5) {
        let middle = Math.floor(step / num)
        let result = []

        for (let i = 0; i < num; i++) {
            let value = step >= middle ? Math.floor(Math.random() * step) : step

            result = [...result, this.time(base + value)]

            step -= value
        }

        return result
    }

    fee(cost = 2e2, percent = 15, duration = 1e1, delay = 0, round = 0) {
        let award = this.cleanValue(percent, cost, round)
        let overtime = this.percent(delay, duration, round)
        let result = delay !== 0 ? this.cleanValue(1e2 - overtime, award, round) : award 

        return result
    }

    timeByDayPart(part = '', base = 0, isSubtraction = false) {
        let value = eval(`${day_parts.find(el => el.title === part)?.border} ${operations.slice(0, 2)[Number(isSubtraction)]} ${base}`) 
        let result = this.time(value)

        return result
    }

    partition(timestamps = [], efficiency = 1e2, round = 1) {
        let result = []
        let size = Math.max(...timestamps) 
        let part = Math.floor(minutesMax / size)

        timestamps.map((el, idx) => {
            let next = timestamps[idx + 1]
        
            if (next) {
                let difference = Math.abs(next - el) * part 
                let border = this.cleanValue(efficiency, difference, round)
                let delay = Math.floor((difference - border) / 2)
        
                result = [...result, [this.time(el * part + delay), this.time(el * part + delay + border)]]
            }
        })

        return result
    }

    week(days = [], hours = 4e1, overtime = 0) {
        let middle = Math.floor(hours / days.length)
        let max = this.cleanValue(1e2 + overtime, middle, 0)
        let result = []

        days.map(el => {
            let day = weekdays[el].tag
            let flag = hours > middle 
            
            let time = this.getIntervalValue([flag ? middle : hours, flag ? max : hours])

            result = [...result, {day, time}]

            hours -= size
        })

        return result
    }

    frames(start = 2e3, end = 21e2, step = 1, size = 1, isYear = true) {
        let result = []

        while (start < end) {
            let frame = [isYear ? start : this.time(start)]

            start += size

            if (start < end) {
                result = [...result, [...frame, isYear ? start : this.time(start)]]
            }
        
            start += step
        }
        
        return result
    }

    life(century = 2e1, percent = 1e1, size = 8e1) {
        let start = century*1e2 - this.cleanValue(percent, size, 0)
        let end = century*1e2 + this.cleanValue(1e2 - percent, size, 0)
        let result = []
        
        result = [start, end]

        return result
    }

    lifePart(periods = [], century = 21, round = 0) {
        const base = (century - 1)*1e2

        let index = Number(periods[1] - base < 1e2 && periods[1] > base)
        let period = periods[index]
        let difference = Math.abs(period - base)
        let result = this.percent(Math.floor(Boolean(index) ? difference : 1e2 - difference), periods[1] - periods[0], round)
        
        return result
    }

    monthDatesByWeekday(date = '', weekday = '') {
        let parts = this.parts(date, '.', true)
        let day = this.weekdayByDate(date)
        let size = this.getMonthSize(parts[1])
        let result = []
        let start, end
        
        weekdays.map((el, idx) => {
            if (el.title === weekday) {
                start = idx
            } else if (el.title === day) {
                end = idx
            }
        })

        let difference = Math.abs(start - end)
        let pointer = start > end ? parts[0] + difference : parts[0] - difference
        let i = pointer % weekdays.length === 0 ? weekdays.length : pointer % weekdays.length

        for (i; i < size; i += weekdays.length) {
            result = [...result, `${this.rounding(i)}.${this.rounding(parts[1])}.${parts[2]}`]
        }

        return result
    }

    weekdayNumByYear(year = 2e3, weekday = 'Monday') {
        let size = this.getYearSize(year)
        let initialWeekday = this.weekdayByDate(`01.01.${year}`)
        let difference = this.weekdaysDifferenceByWeek(initialWeekday, weekday, 0)
        let result = 0

        size = difference <= 0 ? size - difference : size - weekdays.length

        result = Math.floor(size / weekdays.length)
    
        return result
    }

    ms(value = null, key = 'convert') {   
        let flag = key === 'convert'
        let result = flag ? [] : 0

        if (flag) {
            msDividers.map((el, idx) => {
                let prev = msDividers[idx - 1]
                let item = prev ? Math.floor((value - result[idx - 1] * msDividers[idx - 1]) / el) : Math.floor(value / el)
          
                result = [...result, this.rounding(item)]
            })

            result = result.join(':')
        
        } else if (key === 'deconvert') {
            let parts = this.parts(value, ':', true)

            if (parts.length === msDividers.length) {

                parts.map((el, idx) => {
                    result += el * msDividers[idx]
                })
            }
        }

        return result
    }

    yearRound(value = 2e3, num = 1e1, percent = 5e1) {
        let border = this.cleanValue(percent, num, 0)
        let residue = value % num
        let result = residue < border ? value - residue : value + (num - residue)

        return result
    }

    weekdaysDifferenceByTime(days = [], times = []) {    
        let result = 0

        times = times.map(el => this.time(el, 'deconvert'))

        days = days.map(day => weekdays.map(el => el.title).indexOf(day))

        result = Math.floor(days[1] - days[0]) * minutesMax
       
        let difference = Math.abs(times[0] - times[1])

        result = times[0] > times[1] ? result - difference : result + difference

        return result
    }

    dateByYearWeek(year = 2e3, num = 1e1) {
        let residue = Math.floor(year % weekdays.length)
        let days = weekdays.length * num + residue
        let month = 1
        let result = ''

        days -= weekdays.length - 2
   
        months.map(el => {
            let size = this.getMonthSize(el)

            if (size <= days) {
                days -= size
                month++
            }
        })

        result = `${this.rounding(days)}.${this.rounding(month)}.${year}`

        return result
    }

    exchangeYearDigit(items = [], indexes = []) {
        let result = []

        if (indexes[0] !== indexes[1]) {

            items = items.map(el => String(el).split(''))
            
            items.map((el, idx) => {
                let from = el.length - indexes[idx]
                let index = Number(!Boolean(idx))
                let into = items[index].length - indexes[index]
                let value = ''

                for (let i = 0; i < el.length; i++) {
                    if (i === from) {
                        value += items[index][into]
                    } else {
                        value += el[i]
                    }
                }

                result = [...result, value]
            })
        }

        return result
    }

    monthDatesByStep(date = '', step = 1) {
        let result = []

        if (this.isDate(date)) {
            let parts = this.parts(date, '.', true)
            let size = this.getMonthSize(parts[1])
            let day = parts[0]
            
            for (day; day < size; day += step) {
                let value = `${this.rounding(day)}.${this.rounding(parts[1])}.${parts[2]}`
            
                result = [...result, value]
            }
        }

        return result
    }

    getYearDigit(year = 2e3, index = 1) {
        let result = Math.floor(year % 1e1**index / 1e1**(index - 1))

        return result
    }

    changeYearDigit(year = 2e3, index = 1, value = 1) {
        let text = String(year).split('')
        let position = text.length - index
        let result = ''

        text.map((el, idx) => {
            if (idx === position) {
                result += value
            } else {
                result += el
            }
        })

        result = Number(result)

        return result
    }

    timeResidue(time = '') {
        let result = this.isTime(time) ? 6e1 - this.time(time, 'deconvert') % 6e1 : ''

        return result
    }

    yearMove(year = 2e3, num = 1e1, isForward = true, border = 2e3) {
        let result = isForward ? year + num : year - num

        result = result <= border && isForward || result >= border && !isForward ? result : border 

        return result
    }

    timePartMultiplicity(time = '', index = 1, num = 5) {
        let result = this.isTime(time) ? this.parts(time, ':', true).reverse()[index - 1] % num === 0 : false

        return result
    }

    yearBorderCheck(year = 2e3, min = 1e3, max = 2e3, isIncludeBorder = true) {
        let result = isIncludeBorder ? year >= min && year <= max : year > min && year < max

        return result
    }

    numToDottedString(year = 2e3) {
        let text = String(year).split('')
        let length = text.length - 1
        let result = []

        for (let i = length; i >= 0; i--) {
            result = [...result, (length - i) % 3 === 0 && i !== length ? text[i] + '.' : text[i]]
        }

        result = result.reverse().join('')

        return result
    }

    yearsByProgression(start = 2e3, size = 1e2, steps = [], round = 0) {
        let result = []

        steps.map(el => {
            let value = start + this.cleanValue(el, size, round)

            result = [...result, value]
        })

        return result
    }

    timestampsByRounding(time = '', step = 1, isForward = true, isIncludeBorder = true) {
        let value = this.time(time, 'deconvert')
        let border = isForward ? 6e1 - value % 6e1 : value % 6e1
        let result = []

        while (border > 0) {
            result = [...result, isForward ? this.time(value + border) : this.time(value - border)]
            
            border -= step
        }

        if (isIncludeBorder) {
            result = [...result, time]
        }

        result = result.reverse()        

        return result
    }

    dateByDays(value = 1e2, year = 2024) {    
        let result = ''
        let months = 1
        let days = 0
        let size = this.getMonthSize(months, year)

        while (value > 0) {
            if (value >= size) {
                value -= size
                months++

                size = this.getMonthSize(months, year)
            } else {
                days = value
                value = 0
            }
        }

        result = `${this.rounding(days)}.${this.rounding(months)}.${year}`

        return result
    }

    yearsByCenturies(centuries = [], values = []) {
        let result = []
        
        values = values.filter(el => el < 1e2)

        centuries.map(century => {
            values.map(value => {
                let item = Math.floor((century - 1) * 1e2 + value)

                result = [...result, item]
            })
        })

        return result
    }

    timestampsByBorders(min = 6e2, max = 1e3, steps = [], round = 0) {
        const difference = Math.abs(max - min)
        let result = []

        steps.map(el => {
            let value = min + this.cleanValue(el, difference, round)
        
            result = [...result, this.time(value)]
        })

        return result
    }

    yearDigitChanges(value = 2e3) {
        let text = String(value).split('').reverse().map(el => Number(el))
        let result = []

        text.map((el, idx) => {
            let next = text[idx + 1]
            let symbol

            if (next !== undefined) {
                if (el === next) {
                    symbol = '='
                } else {
                    symbol = el > next ? '-' : '+'
                }
                
                result = [...result, symbol]
            }       
        })

        return result
    }

    timestampsByTimeParts(hours = [], minutes = []) {
        let result = []
    
        hours.map(hour => {
            minutes.map(minute => {
                let value = hour * 6e1 + minute

                result = [...result, this.time(value)]
            })
        })

        return result
    }

    yearByParameters(century = 2e1, quarter = 1, isEven = true, border = 0) {
        let check = (even, num) => even ? num % 2 === 0 : num % 2 !== 0
        let result = isEven ? 1 : 0
        let min, max

        min = Math.floor(century - 1) * 1e2 + (quarter - 1) * 25

        max = min + 25

        min += border
        max -= border
   
        while (!check(isEven, result)) {
            result = this.getIntervalValue([min, max])
        }

        return result
    }
    
    yearBySchema(schema = '', marker = 'x') {
        let num = schema.length === 4 ? 2 : 9
        let result = ''

        schema.split('').map((el, idx) => {
            if (el === marker) {
                result += idx === 0 ? this.getIntervalValue([1, num]) : this.getIntervalValue([0, 9])
            } else {
                result += el
            }
        })
      
        result = Number(result)

        return result
    }

    yearByParity(num = 1e1, min = 1e3, max = 2e3) {
        let border = Math.floor(max / num)
        let result = 0

        while (result < min) {
            result = this.getIntervalValue([1, border]) * num
        }

        return result
    }

    timeHourReflection(time = '') {
        let result = this.isTime(time) ? 24 - Math.ceil(this.time(time, 'deconvert') / 6e1) : 0

        return result
    }

    findMiddleYear(values = [], isCeil = true) {
        let min = Math.min(...values)
        let max = Math.max(...values)
        let difference = (max - min)
        let residue = Math[isCeil ? 'ceil' : 'floor'](difference / 2)
        let pick = min + residue
        let result = 0

        values.map(el => {
            let value = Math.abs(el - pick)
 
            if (residue > value) {
                residue = value
                result = el
            }
        })

        return result
    }

    findLastingYearEnd(year = 2e3, duration = 5e1, percent = 1e1, round = 0) {
        let value = this.cleanValue(percent, duration, round)
        let result = year + (duration - value)

        return result
    }

    findLastingYearPercent(year = 2e3, min = 2e3, max = 21e2, round = 0) {
        let difference = Math.abs(max - min)
        let result = this.percent(Math.abs(year - min), difference, round)

        return result
    }

    sortYearsByDigit(arr = [], index = 1) {
        for (let i = 1; i < arr.length; i++) {
            let current = arr[i]
            let j = i - 1
            
            while (j >= 0 && this.getYearDigit(arr[j], index) > this.getYearDigit(current, index)) {
                arr[j + 1] = arr[j]
                j--
            } 

            arr[j + 1] = current
        }

        return arr
    }

    getTimeParity(time = '') {
        let result = 0

        if (this.isTime(time)) {
            let border = this.time(time, 'deconvert')
            let value = Math.floor(border / 2)
            let i = 1

            while (i < value) {
                if (border % i === 0) {
                    result = i
                }
                
                i++
            }
        }

        return result
    }

    validateYearPart(year = 2e3, start = 1, end = 1, validationText = '') {
        let text = ''
        let result = true
        
        for (let i = end; i >= start; i--) {
            text += this.getYearDigit(year, i)
        }
       
        result = eval(`${text}${validationText}`)

        return result
    }

    checkTimeByBorders(time = '', min = 6e2, max = 1e3, isLowerBorderInclude = true, isHighBorderInclude = true) {
        let result = true

        if (this.isTime(time)) {
            let value = this.time(time, 'deconvert')
            
            result = isLowerBorderInclude ? value >= min : value > min  
            
            if (result === true) {
                result = isHighBorderInclude ? value <= max : value < max
            }            
        }
        
        return result
    }

    dateByNum(num = 1e3, round = 0) { 
        let year = parseInt(num)
        let residue = this.cleanValue((num % year) * 1e2, this.getYearSize(year), round) 
        let result = this.dateByDays(residue, year)

        return result
    }

    percentOfTimeMaximum(times = [], percent = 1e1, round = 0) {
        let max = Math.max(...times.map(el => this.time(el, 'deconvert')))
        let result = this.cleanValue(percent, max, round)

        return result
    }

    findYearAverageGap(items = []) {    
        const length = items.length - 1
        let result = 0
    
        for (let i = 0; i < length; i++) {
            let current = items[i]
            let next = items[i + 1]
   
            result += Math.abs(next - current)
        }

        result = Math.round(result / length)

        return result
    }

    findTimeWithSmallestMinutePart(times = []) {
        let max = 6e1
        let result = ''

        times.map(el => this.time(el, 'deconvert')).map(el => {
            let value = el % 6e1

            if (max > value) {
                max = value
                result = this.time(el)
            }
        })

        return result
    }

    timeByMultiplicity(num = 1e1, min = 6e1) {
        num = num > 0 && num <= 6e1 ? num : Math.abs(6e1 - num)
        
        let result = 0
        let border = Math.floor(minutesMax / num)

        while (result < min) {
            result = this.getIntervalValue([0, border]) * num
        }

        result = this.time(result)

        return result
    }

    mostVariousYear(years = []) {   
        let changes = 0
        let result = 0

        years.map(el => {
            let value = String(el).split('').map(el => Number(el))
            let difference = 0

            value.map((item, i) => {
                let next = value[i + 1]

                if (next !== undefined) {
                    difference += Math.abs(item - next)
                }
            })
           
            if (difference > changes) {
                changes = difference
                result = el
            }
        })

        return result
    }

    findNearestTimeRoundMinutes(time = '', minutes = [], isIncrease = true) {
        let border = 6e1
        let result = 0

        if (this.isTime(time)) {
            let residue = this.time(time, 'deconvert')

            residue = residue % 6e1
            residue = isIncrease ? 6e1 - residue : residue
            
            minutes.map(el => {
                let difference = Math.abs(el - residue)

                if (difference < border) {
                    border = difference
                    result = el
                }
            })
        }

        return result
    }

    filterYearsByCenturies(list = [], borders = [], exception = null) {
        let result = []
  
        borders = borders.map(el => (el - 1)*1e2)
        
        const check = num => borders[0] <= num && borders[1] >= num

        list.map(el => {
            if (check(el) && Math.ceil(el / 1e2) !== exception) {
                result = [...result, el]
            }      
        })

        return result
    }

    filterTimesByInterval(timestamps = [], start = 1e1, num = 1, isMinutes = false) {
        let index = Number(isMinutes)
        let result = []

        const check = time => time >= start && time <= start + num

        timestamps.map(el => {
            if (this.isTime(el)) {
                let parts = this.parts(el, ':', true)

                if (check(parts[index])) {
                    result = [...result, el]
                }
            }
        })

        return result
    }

    filterDatesByMonthGap(dates = [], min = 1e1, max = 1e2, round = 0) {
        let result = []

        const check = num => num >= min && num <= max

        dates.map(el => {
            if (this.isDate(el)) {
                let parts = this.parts(el, '.', true)
                let size = this.getMonthSize(parts[1], parts[2])

                let value = this.percent(parts[0], size, round)

                if (check(value)) {
                    result = [...result, el]
                }
            }
           
        })

        return result
    }

    filterTimePartsByInterval(time = '', min = 1, max = 1e1) {
        let result = true

        if (this.isTime(time)) {
            let parts = this.parts(time, ':', true)

            parts.map(el => {
                if (el >= min && el <= max && result) {
                    result = true
                } else {
                    result = false
                }
            })
        }

        return result
    }

    yearsDifferenceOrder(min = 1e3, max = 2e3) {
        let difference = Math.abs(max - min)
        let result = 0

        while (difference > 1e1) {
            difference *= .1
            result++
        }

        result = 1e1**result

        return result
    }

    timeByRatio(hours = 1e1, num = 1) {
        let result = this.time(hours * 6e1 + hours * num)

        return result
    }

    yearsInsideBorders(min = 1e3, max = 2e3, step = 1) {
        let result = []

        while (min < max) {
            result = [...result, min]

            min += step
        }

        return result
    }

    findNearestYearFromList(value = 1e3, list = [], isEven = true) {
        let border = 1e3
        let result = 0

        for (let i = 0; i < list.length; i++) {
            let item = list[i]
            let flag = isEven ? item % 2 === 0 : item % 2 !== 0
            
            if (flag) {
                let difference = Math.abs(value - item)

                if (difference < border) {
                    result = item
                    border = difference
                }
            }
        }

        return result
    }

    filterTimesByParity(times = [], num = 1e1, borders = [0, minutesMax]) {
        const check = int => borders[0] <= int && borders[1] >= int
        let result = []        

        times.map(el => {
            if (this.isTime(el)) {
                let value = this.time(el, 'deconvert')
                let flag = value % num === 0 && check(value)

                if (flag) {
                    result = [...result, el]
                }
            }
        })

        return result
    }

    numDigitInResidueExist(num = 1e1, position = 1) {
        let digit = this.getYearDigit(num, position)
        let items = String(num).split('.')[1].split('')
        let result = false

        items.map(el => {
            if (Number(el) === digit) {
                result = true
            }
        })

        return result
    }

    digitsOfNum(num = 1e1) {
        const int = num

        let result = []
        let position = 1

        while (num > 0) {
            let value = this.getYearDigit(int, position) * 10**(position - 1)

            result = [...result, value]
            
            num -= value
            position++
        }

        result = result.reverse()

        return result
    }

    filterYearsByDeviation(list = [], year = 1e3, dispersion = 5, isEven = null) {
        let result = []

        list.map(el => {
            let difference = Math.abs(year - el)
            let check = false

            if (difference <= dispersion) {
                if (isEven !== null) {
                    check = isEven === true && el % 2 === 0 || isEven === false && el % 2 !== 0
                } else {
                    check = true
                }
            }

            if (check) {
                result = [...result, el]
            }
        })

        return result
    }

    numResidueSum(num = 1e1) {
        let result = 0

        if (String(num).includes('.')) {
            result = String(num).split('.')[1].split('').map(el => Number(el)).reduce((acc, cur) => acc + cur)
        }

        return result
    }

    filterTimesByDifference(times = [], difference = 1e1) {
        let result = []

        times.map((el, idx) => {
            if (this.isTime(el)) {
                let next = times[idx + 1]

                if (next) {
                    let value = this.time(el, 'deconvert')
                    let toCompare = this.time(next, 'deconvert')
                
                    if (Math.abs(value - toCompare) <= difference) {
                        result = [...result, el]
                    }
                }
            
            }            
        })

        return result
    }   

    numSimpleProgression(start = 1e3, step = 1, length = 1e1, isIncrease = true) {
        let result = []
        let value = start

        for (let i = 0; i < length; i++) {
            value = isIncrease ? value + step : value - step

            result = [...result, value]
        }

        return result
    }

    timestampsByRadius(base = 6e2, border = 1e2, forward = 1, back = forward) {
        const sum = forward + back

        let step = Math.round(border / back)
        let result = []
        let value = base - border

        for (let i = 0; i < sum; i++) {
            result = [...result, this.time(value)]
            
            if (i === back) {
                step = Math.round(border / forward)
            }

            value += step
        }

        return result
    }

    filterYearsByRadius(list = [], radius = 1e1, middle = 5e1) {
        let borders = [middle - radius, middle + radius]
        let result = []

        list.map(el => {
            let value = el % 1e2

            if (borders[0] <= value && borders[1] >= value) {
                result = [...result, el]
            }
        })

        return result
    }

    filterYearBySchema(value = 1e3, schema = '', marker = '*') {
        let symbols = String(value).split('')
        let result = true

        symbols.map(el => Number(el)).map((el, idx) => {
            let check = schema[idx]
           
            if (check !== marker) {
                check = Number(check)
                
                if (el !== check) {
                    result = false
                }             
            }
        })

        return result
    }

    timeTransform(time = '', num = 1e1, isIncrease = true) {
        let result = ''

        if (this.time(time)) {
            let value = this.time(time, 'deconvert')

            value = isIncrease ? value + num : value - num

            result = this.time(value)
        }

        return result
    }

    filterYearsByDifference(list = [], min = 0, max = 1e1) {
        let result = []

        const check = num => num >= min && num <= max

        list.map((el, idx) => {
            let next = list[idx + 1]

            if (next) {
                let difference = Math.abs(el - next)

                if (check(difference)) {
                    result = [...result, el]
                }
            }
        })

        return result
    }

    averageTimeByIndexParity(list = [], num = 1) {
        const length = Math.floor(list.length / num)
        let result = 0
        
        list.map((el, idx) => {
            if (this.isTime(el) && idx !== 0 && (idx + 1) % num === 0) {
                result += this.time(el, 'deconvert')
            }
        })

        result = Math.round(result / length)

        result = this.time(result)

        return result
    }

    findLargestTimeDifference(list = []) {
        let result = 0

        list.map((el, idx) => {
            let next = list[idx + 1]

            if (next) {
                let difference = this.time(this.timeDistance(el, next), 'deconvert')

                if (difference > result) {
                    result = difference
                }
            }
        })

        return result
    }

    filterYearsByMultiplicity(list = [], num = 1) {
        let result = []

        list.map(el => {
            if (el % num === 0) {
                result = [...result, el]
            }
        })

        return result
    }

    numPercentProgression(num = 1, percent = 1e1, iterations = 1, round = 0) {
        const step = 1 + this.cleanValue(percent, 1, 2)
        let result = num
        
        for (let i = 0; i < iterations; i++) {
            result *= step
        } 

        result = this.cleanValue(1e2, result, round)

        return result
    }

    analysisProgressionIterations(list = []) {
        let result = []

        list.map((el, idx) => {
            let next = list[idx + 1]

            if (next) {
                let couple = [el, next]
                let difference = Math.abs(el - next)
                let max = Math.max(...couple)
                let min = Math.min(...couple)
                let symbol

                if (max % min !== 0) {
                    symbol = el <= next ? '+' : '-'
                } else if (difference >= min && max % min === 0) {
                    symbol = el < next ? '*' : '/'
                    
                    difference = Math.floor(max / min) 
                }

                let iteration = `${symbol} ${difference}`

                if (result.find(item => item === iteration) === undefined) {
                    result = [...result, iteration]
                }                
            }
        })
        
        return result
    }

    checkTimeByMultiplicityNumbers(time = '', nums = []) {
        let result = true

        if (this.isTime(time)) {
            let value = this.time(time, 'deconvert')

            nums.map(el => {
                if (value % el !== 0) {
                    result = false
                }
            })
        }

        return result
    }

    findYearsAverageCenturyGap(list = []) {
        let result = 0

        list.map(el => {
            let value = 1e2 - el % 1e2

            result += value
        })

        result = Math.round(result / list.length)

        return result
    }

    stream(times = [], durations = []) {
        let result = [times[0]]
        let index = 0

        for (let i = 1; i < times.length; i++) {
            let start = this.time(times[i], 'deconvert')
            let end = start + durations[i]
            
            let startToCompare = this.time(times[index], 'deconvert') 
            let endToCompare = startToCompare + durations[index]

            let right = result.length
            let left = 0

            while (startToCompare > start && endToCompare > start && index > left) {
                startToCompare = this.time(times[index], 'deconvert') 
                endToCompare = startToCompare + durations[index]

                index--
            }

            while (startToCompare < end && endToCompare < end && index < right) {
                startToCompare = this.time(times[index], 'deconvert') 
                endToCompare = startToCompare + durations[index]

                index++
            }

            result = [...result.slice(left, index), times[i], ...result.slice(index, right)]
        }

        return result
    }

    filterYearsByParityOfDifference(list = [], num = 1) {
        let result = []

        list.map((el, idx) => {
            let next = list[idx + 1]

            if (next) {
                let difference = Math.abs(el - next)

                if (difference % num === 0) {
                    result = [...result, el]
                }
            }
        })

        return result
    }

    filterYearsByResidueFill(list = []) {
        let result = []

        list.map((el, idx) => {
            let next = list[idx + 1]

            if (next) {
                if (next % 1e2 >= 1e2 - el % 1e2) {
                    result = [...result, el]
                }
            }
        })

        return result
    }

    filterYearsByDifferenceComparing(list = [], num = 1e3, isMore = true) {
        let result = []

        list.map((el, idx) => {
            let next = list[idx + 1]
            
            if (next) {
                let difference = Math.abs(next - el)

                if (isMore && difference > num || !isMore && difference < num) {
                    result = [...result, el]
                }
            }
        })

        return result
    }

    findYearsParitySubsequences(list = [], seq = []) {
        let result = []
        let subsequence = []
        let index = 0

        for (let i = 0; i < list.length; i++) {
            let value = list[i]
            let parity = seq[index]

            if (value % parity === 0) {
                subsequence = [...subsequence, value]
                
                index++
            } else {
                result = [...result, subsequence]

                index = 0
                subsequence = []
            }
        }

        result = result.filter(el => el.length === seq.length).flat(1)

        return result
    }

    filterTimesByMove(list = [], isIncrease = true) {
        let result = []

        list.map(el => {
            if (this.isTime(el)) {
                let value = this.time(el, 'deconvert')
                let latest = result.length !== 0 ? this.time(result[result.length - 1], 'deconvert') : 0
                let check = isIncrease ? latest < value : latest > value 

                if (check) {
                    result = [...result, el]
                }
            }
        })

        return result
    }

    yearsBorders(list = []) {
        let min = 1e6
        let max = 0
        let result

        list.map(el => {
            if (el > max) {
                max = el
            } else if (el < min) {
                min = el
            }
        })

        result = [min, max]

        return result
    }

    yearsCenturies(list = []) {
        let max = Math.ceil(list[0] / 1e2)
        let min = max
        let result = [min]

        const check = num => min <= num && max >= num

        list.map(el => {
            let value = Math.ceil(el / 1e2)

            if (!check(value)) {
                let differenceMax = Math.abs(max - value)
                let differenceMin = Math.abs(min - value)
             
                if (differenceMin > 1 || differenceMax > 1) {
                    result = [...result, value]
                } else if (differenceMax === 1) {
                    max = value
                    result = [...result, value]
                } else if (differenceMin === 1) {
                    min = value
                    result = [...result, value]
                }
            }
        })

        result = result.sort()

        return result
    }

    filterYearsByVariation(list = [], year = 1e3, less = 0, more = 0) {
        const max = year + more
        const min = year - less

        let result = []

        list.map(el => {
            if (el <= max && el >= min) {
                result = [...result, el]
            }    
        })

        return result
    }

    timeAmbit(time = '', num = 1e1) {
        let result = 0

        if (this.isTime(time)) {
            let value = this.time(time, 'deconvert')

            result = [this.time(value - num), this.time(value + num)]
        }

        return result
    }

    timeMultiplicityResidue(time = '', num = 6e1, round = 0) {
        let result = 0

        if (this.isTime(time)) {
            let value = this.time(time, 'deconvert')

            value %= num

            result = this.percent(value, num, round)
        }

        return result
    }

    yearsByCustomSizes(year = 1e3, sizes = [], iterations = 1) {
        let result = []

        for (let i = 0; i < iterations; i++) {
            sizes.map(el => {
                result = [...result, year + el]
                
                year += el
            })
        }

        return result
    }

    yearsAllocation(borders = [], step = 1) {
        let max = Math.max(...borders)
        let min = Math.min(...borders)
        let result = []

        while (min <= max) {
            result = [...result, min]

            min += step           
        }

        return result
    }

    timeByPercentOfStep(time = '', step = 1e1, percent = 1e1, isForward = true) {
        let result = 0

        if (this.isTime(time)) {
            let base = this.time(time, 'deconvert')
            let value = this.cleanValue(percent, step, 0)

            result = isForward ? base + value : base - value
        }

        result = this.time(result)

        return result
    }

    yearAmbit(year = 1e3, num = 1e1, isCheckCentury = false) {
        let result = [year - num, year + num]

        if (isCheckCentury) {
            let century = Math.floor(year / 1e2)

            result = result.map(el => {
                if (century === Math.floor(el / 1e2)) {
                    return el
                } else {
                    return year
                }
            })
        }

        return result
    }

    yearsMutateByIndex(list = [], index = 1, num = 0, isIncrease = true) {
        let result = []

        list.map((el, idx) => {
            let position = idx + 1
            let value = el

            if (position % index === 0) {
                value = isIncrease ? value + num : value - num
            }

            result = [...result, value]
        })

        return result
    }

    yearsFromCentre(year = 1e3, step = 1, radius = 1) {
        let d = radius * 2
        let result = []

        year -= step * radius

        for (let i = 0; i < d; i++) {
            result = [...result, year]

            year += step
        }

        return result
    }

    yearByPercentInsideBorders(min = 1e3, max = 2e3, percent = 5) {
        let difference = Math.abs(max - min)
        let result = min + this.cleanValue(percent, difference, 0)
    
        return result
    }

    findNearestYearByMultiplicity(year = 1e3, num = 1, isMore = true) {
        let size = Math.floor(year / num)
        let result = isMore ? size + 1 : size - 1

        result *= num

        return result
    }

    timeIntersection(time = '', min = 1, max = 1) {
        let result = 0

        if (this.isTime(time)) {
            let value = this.time(time, 'deconvert')
            let step = min

            while ((min % step !== 0 || max % step !== 0) && step < max) {
                step += min
            }

            result = value + step
        }

        result = this.time(result)

        return result
    }

    isYear(value = null) {
        let result = false

        if (value !== null && value !== undefined) {
            result = typeof value === 'number' && value >= 0 && value <= 3e3
        }

        return result
    }

    numLevelsOfMultiplicity(value = 2e3, num = 1) {
        let result = 0

        while (value % num === 0) {
            value /= num
            result++
        }

        return result
    }

    timesInsideBorders(min = 1e2, max = 1e3, step = 1e1) {
        let result = []

        while (min < max) {
            result = [...result, this.time(min)]

            min += step
        }

        return result
    }

    sizeOfEra(year = 1e1, round = 0) {
        let result = this.percent(year, this.date.getFullYear(), round)

        return result
    }

    yearsByExceptTemplateDigit(year = 1e3, num = 1) {
        const length = String(year).length

        let digit = this.getYearDigit(year, num)
        let result = []

        for (let i = Number(num === length); i < 1e1; i++) {
            let difference = Math.abs(digit - i) * 1e1**(num - 1)
         
            if (i !== digit) {
                result = [...result, i < digit ? year - difference : year + difference]
            }
        }

        return result
    }

    yearsByPairs(start = 1e3, num = 5, step = 1, difference = 1) {
        let result = []

        for (let i = 0; i < num; i++) {
            result = [...result, start, start + difference]
        
            start += step
        }

        return result
    }

    filterYearsByEqualAdjacentDigits(list = [], position = 1) {
        let result = []

        list.map(el => {
            let text = String(el)
            let index = position + (text.length > position ? 1 : -1)
            let value = this.getYearDigit(el, position)
            let toCompare = this.getYearDigit(el, index)
          
            if (value === toCompare) {
                result = [...result, el]
            }
        })

        return result
    }

    filterYearsByParityDigits(list = [], parity = []) {
        let result = []

        list.map(el => {
            let text = String(el).split('')
            let flag = true

            text.map((_, i) => {
                let value = this.getYearDigit(el, i + 1)
             
                if (parity[i] !== (value % 2 === 0)) {
                    flag = false
                }
            })

            if (flag) {
                result = [...result, el]
            }
        })

        return result
    }

    timeByMinuteResiduePercent(time = '', percent = 1e1, size = 6e1, isAfter = true) {
        let result = ''

        if (this.isTime(time)) {
            let minutes = this.time(time, 'deconvert') 
            let residue = minutes % size
            let value = this.cleanValue(percent, isAfter ? size - residue : residue, 0)

            result = this.time(isAfter ? minutes + value : Math.floor(minutes / size) * size + value)
        }

        return result
    }

    findNearestYearByPercent(list = [], percent = 1e1) {
        const min = Math.min(...list)
        const max = Math.max(...list)

        let difference = Math.abs(max - min)
        let value = min + this.cleanValue(percent, difference, 0)
        let distance = 1e5
        let result = 0

        list.map(el => {
            let change = Math.abs(el - value)

            if (change < distance) {
                distance = change
                result = el
            }
        })
    
        return result
    }

    timeBorders(time = '', percent = 5e1, size = 1e2, isForward = true) {
        let result = []

        if (this.isTime(time) && percent >= 0 && percent <= 1e2) {
            let value = this.time(time, 'deconvert')
            let back = 1e2 - percent
            let right, left 

            if (isForward) {
                right = percent
                left = back
            } else {
                right = back
                left = percent 
            }

            result = [this.time(value - this.cleanValue(left, size, 0)), this.time(value + this.cleanValue(right, size, 0))]
        }

        return result
    }

    percentByYearInsideBorders(min = 1e3, max = 2e3, year = 1e3) {
        let difference = Math.abs(max - min)
        let result = this.percent(Math.abs(year - min), difference, 0)

        return result
    }

    findDispersionOfCentury(list = [], century = 2e1) {
        const year = (century - 1) * 1e2
        
        let min = 1e5
        let max = 0
        let result = 0
    
        list.map(el => {
            if (el > year && el % year < 1e2) {
                if (el > max) {
                    max = el
                } else if (el < min) {
                    min = el
                }
            }
        })

        result = max - min

        return result
    }

    findMaximumOfCentury(list = [], century = 2e1, isEven = null) {
        const year = (century - 1) * 1e2
        let result = 0

        list.map(el => {
            if (el > year && el % year < 1e2 && result < el) {
                if (isEven !== null) {
                    let flag = el % 2 === 0
                
                    if (isEven === flag) {
                        result = el
                    }
                } else {
                    result = el
                }
            }
        })
    
        return result
    }

    yearsByCenturiesRandomlyRow(centuries = [], borders = [], iterations = 1) {
        let result = []

        for (let i = 0; i < iterations; i++) {
            centuries.map(el => {
                let value = (el - 1) * 1e2 + this.getIntervalValue(borders)

                result = [...result, value]
            })
        }

        return result
    }

    numCompareWithBorders(num = 1, list = [], isMore = true, percent = null) {
        const border = this.cleanValue(percent, num, 0)
        let result = []

        list.map(el => {
            let flag = isMore && num > el || !isMore && num < el

            if (percent !== null) {
                let difference = Math.abs(el - num)

                if (difference > border) {
                    flag = false
                }
            }

            if (flag) {
                result = [...result, el]
            }
        })

        return result
    }

    numPositionInsideBorders(num = 1, min = 1, max = 1e1, round = 0) {
        let difference = Math.abs(max - min)
        let result = this.percent(Math.abs(num - min), difference, round)

        return result
    }

    buildNumBorders(min = 0, numbers = []) {
        let result = []

        for (let i = 0; i < numbers.length; i++) {
            let current = numbers[i]

            result = [...result, [min, current]]
        
            min = current
        }

        return result
    }

    yearsByCenturyBorders(borders = [], num = 1e1, step = 5) {
        let result = []

        borders = borders.map(el => (el - 1) * 1e2 + num)

        while (borders[0] <= borders[1]) {
            result = [...result, borders[0]]

            borders[0] += step
        }

        return result
    }

    filterYearsByDifferenceSubsequence(list = [], seq = []) {
        let result = []
        let index = 0
        
        list.map((el, idx) => {
            let next = list[idx + 1]

            if (next) {
                let difference = Math.abs(next - el)
            
                if (difference === seq[index]) {
                    result = [...result, el, next]
                    index++
                }
            }
        })

        return result
    }

    findMaximumNumDifferenceByIndexedDistance(list = [], percent = 1e1) {
        let distance = this.cleanValue(percent, list.length, 0)
        let result = 0
        let index = 0

        while (index < (list.length - distance)) {
            let first = list[index]
            let second = list[distance + index]
        
            let difference = Math.abs(first - second)

            if (difference > result) {
                result = difference
            }

            index++
        }

        return result
    }

    findNumDistanceByDifference(list = [], percent = 1e1) {
        let max = Math.max(...list)
        let min = Math.min(...list)
        let difference = Math.abs(max - min)
        let deviation = 1e5
        let result = []

        difference = this.cleanValue(percent, difference, 0)

        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list.length; j++) {
                let value = Math.abs(list[j] - list[i])
                let odds = Math.abs(value - difference)
       
                if (odds < deviation) {
                    result = [i, j]
                    deviation = odds
                }
            }
        }

        return result
    }

    nearestTimesByMultiplicity(time = '', num = 5, radius = 1) {
        let result = []

        if (this.isTime(time)) {
            let value = this.time(time, 'deconvert')
            let steps = Math.floor(value / num)

            value = steps * num
            value -= num * radius
            
            for (let i = 0; i < radius * 2; i++) {
                value += num

                result = [...result, this.time(value)]
            }
        }

        return result
    }

    filterYearsByDifferenceInverval(list = [], min = 0, max = 1e1) {
        let result = []

        const check = num => num >= min && num <= max
            
        list.map((el, idx) => {
            let next = list[idx + 1]

            if (next) {
                let difference = Math.abs(next - el)

                if (check(difference)) {
                    result = [...result, el, next]
                }
            }
        })

        return result
    }

    yearsByCenturiesMultiplicity(centuries = [], min = 0, max = 1e2, num = 1) {
        let result = []

        centuries.map(el => {
            let base = (el - 1) * 1e2 
            let start = base + min
            let end = base + max

            start = Math.floor(start / num) * num

            while (start < end) {
                result = [...result, start]
                
                start += num
            }
        })

        return result
    }

    findNumLargestCompareSubsequence(list = [], num = 1, isMore = true) {
        let result = []
        let seq = []
        let maxlength = 0

        list.map(el => {
            let check = isMore && num > el || !isMore && num < el

            if (check) {
                seq = [...seq, el]
            } else {
                seq = []
            }

            if (seq.length > maxlength) {
                result = seq
                maxlength = seq.length
            }
        })

        return result
    }

    filterYearsByResidueExclude(list = [], num = 1e1) {
        let result = []

        list.map(el => {
            let value = el % 1e2

            if (value !== num) {
                result = [...result, el]
            }
        })

        return result
    }

    findNumMultiplicityList(list = [], num = 1) {
        let result = []

        list.map(el => {
            let value = el % num

            if (!Boolean(value)) {
                result = [...result, el]
            }
        })

        return result
    }

    filterYearsByResidueInterval(list = [], min = 0, max = 1e2, isEven = null) {
        let result = []

        list.map(el => {
            let value = el % 1e2
            let flag = value >= min && value <= max

            if (flag && isEven !== null) {
                flag = isEven && value % 2 === 0 || !isEven && value % 2 !== 0
            }

            if (flag) {
                result = [...result, el]
            }
        })

        return result
    }

    timeByMinutePercent(time = '', num = 1e2, list = [], round = 0) {
        let result = []
        
        if (this.isTime(time)) {
            const base = this.time(time, 'deconvert')
        
            list.map(el => {
                let value = this.cleanValue(Math.abs(el), num, round)
                
                value = el > 0 ? base + value : base - value

                result = [...result, this.time(value)]
            })
        }

        return result
    }

    filterYearsByCenturyExclude(list = [], century = 0) {
        let result = []

        list.map(el => {
            let value = Math.ceil(el / 1e2)
        
            if (value !== century) {
                result = [...result, el]
            }
        })

        return result
    }

    filterTimeByMinuteBorders(time = '', num = 1e1, isInside = true) {
        let result = true

        if (this.isTime(time)) {
            let borders = [num, 6e1 - num] 
            let value = this.time(time, 'deconvert') % 6e1
           
            result = isInside ? value >= borders[0] && value <= borders[1] : (value <= borders[0] || value >= borders[1])
        }

        return result
    }

    filterYearsByCenturyRadius(list = [], century = 2e1, num = 1e1) {
        let base = (century - 1) * 1e2
        let borders = [base - num, base + num]
        let result = []

        list.map(el => {
            if (el >= borders[0] && el <= borders[1]) {
                result = [...result, el]
            }
        })

        return result
    }

    yearsByRow(year = 1e3, steps = [], jump = 1e1, iterations = 1) {
        let result = []

        for (let i = 0; i < iterations; i++) {
            for (let j = 0; j < steps.length; j++) {    
                let step = steps[j]

                year += step

                result = [...result, year]
            }

            year += jump
        }

        return result
    }

    numPercentBorders(num = 1, percent = 1e1, round = 0) { 
        let size = this.cleanValue(percent, num, round)
        let result = [num - size, num + size]
    
        return result
    }

    yearsByFractions(start = 1e3, end = 2e3, list = []) {   
        const difference = Math.abs(end - start)
        const isIncrease = start < end
        const max = Math.max(...list)

        let result = []

        list.map(el => {
            let size = Math.floor(el / max * difference)
            
            let value = isIncrease ? start + size : start - size
            
            result = [...result, value]
        })

        return result
    }

    findNumDigitPercentFromAll(num = 1, digit = 1, round = 0) {
        let value = this.getYearDigit(num, digit)
        let result = this.percent(value * 1e1**(digit - 1), num, round)

        return result
    }

    filterTimesByPartsDifferenceValue(list = [], min = 0, max = 1e2, round = 0) {
        let result = []

        list.map(el => {
            if (this.isTime(el)) {
                let parts = this.parts(el, ':', true)
                let value = Math.min(...parts)
                let difference = Math.abs(parts[1] - parts[0])
                let percent = this.percent(difference, value, round)

                if (percent >= min && percent <= max) {
                    result = [...result, el]
                }
            }
        })

        return result
    }

    numReverse(num = 1) {
        const length = String(num).length
        let result = new Array(length).fill(0)

        for (let i = 1; i <= length; i++) {
            let digit = this.getYearDigit(num, i)

            result[i] = digit
        }

        result = Number(result.join(''))

        return result
    }

    yearsByJumping(year = 1e3, steps = [], jumps = []) {
        let result = []

        for (let i = 0; i <= jumps.length; i++) {
            steps.map(el => {
                year += el

                result = [...result, year]
            })

            year += jumps[i]
        }

        return result
    }

    filterTimesByPartsComparing(list = [], isMore = true) {
        let result = []

        list.map(el => {
            if (this.isTime(el)) {
                let parts = this.parts(el, ':', true)
                let flag = isMore ? parts[0] > parts[1] : parts[0] <= parts[1]
            
                if (flag) {
                    result = [...result, el]
                }
            }
        })

        return result
    }

    timeByRandomlyGap(time = '', num = 1e1, isIncrease = true) {
        let result = 0

        if (this.isTime(time)) {
            let value = this.time(time, 'deconvert')
            let gap = this.getIntervalValue([0, num])

            value = isIncrease ? value + gap : value - gap

            result = this.time(value)
        }

        return result
    }

    yearByRandomlyGap(year = 1e3, num = 1e1, isIncrease = true, isEven = null) {
        let gap = this.getIntervalValue([0, num])
        let result = isIncrease ? year + gap : year - gap
    
        if (isEven !== null) {
            while (isEven && result % 2 !== 0 || !isEven && result % 2 === 0) {
                gap = this.getIntervalValue([0, num])
                
                result = isIncrease ? year + gap : year -gap
            }
        }

        return result
    }

    filterYearsByDifferenceResidueInterval(list = [], min = 1e1, max = 5e1) {
        let result = []

        list.map((el, idx) => {
            let next = list[idx + 1]

            if (next) {
                let difference = Math.abs(el % 1e2 - next % 1e2)

                if (difference >= min && difference <= max) {
                    result = result[result.length - 1] === el ? [...result, next] : [...result, el, next]
                }
            }
        })

        return result
    }
    
    yearsByRandomlyDeviation(year = 1e3, num = 1, max = 1e1, isIncrease = true) {
        let result = []

        for (let i =  0; i < num; i++) {
            let value = this.getIntervalValue([0, max])

            value = isIncrease ? year + value : year - value

            result = [...result, value]
        }
    
        return result
    } 
    
    filterTimesByPartsMultiplicity(list = [], num = 1) {
        let result = []

        list.map(el => {
            if (this.isTime(el)) {
                let parts = this.parts(el, ':', true)
                let flag = true

                parts.map(part => {
                    if (part % num !== 0) {
                        flag = false
                    }
                })

                if (flag) {
                    result = [...result, el]
                }
            }
        })

        return result
    }

    filterAdjacentYearsBySameCentury(list = [], isSpread = true) {
        let result = []

        list.map((el, idx) => {
            let next = list[idx + 1]

            if (next) {
                let flag = Math.ceil(el / 1e2) === Math.ceil(next / 1e2)
                let value = result[result.length - 1] === el ? [next] : [el, next]

                if (flag) {
                    result = isSpread ? [...result, ...value] : [...result, value]
                }
            }
        })

        return result
    }

    yearDispersionByRadius(year = 1e3, num = 1) {
        let border = this.getIntervalValue([0, num])
        let result = [year - border, year + border]
    
        return result
    }

    yearBordersByPercent(year = 1e3, size = 1e2, borders = []) {
        let result = borders.map((el, idx) => eval(`${year}${Boolean(idx) ? '+' : '-'}${this.cleanValue(el, size, 0)}`) )

        return result
    }

    filterTimeWithGapByMultiplicity(time = '', gap = 1e1, num = 1, isForward = true) {
        let result = true

        if (this.isTime(time)) {
            let minutes = this.time(time, 'deconvert') 

            minutes = isForward ? minutes + gap : minutes - gap

            result = minutes % num === 0
        }

        return result
    }

    largestFractionaNumPartByDividerInterval(num = 1, interval = []) {
        let length = 0
        let result = 0

        for (let i = interval[0]; i < interval[1]; i++) {
            let value = String((num % i / i))

            if (value.includes('.')) {
                value = value.split('.')[1]
            }

            if (value.length > length) {
                length = value.length
                result = i
            }
        }

        return result
    }

    filterAdjecentTimesByPartActionMultiplicity(list = [], num = 1, isMinutes = true, isSum = true) {
        let result = []

        list.map((el, idx) => {
            let next = list[idx + 1]

            if (this.isTime(el) && this.isTime(next)) {
                let index = Number(isMinutes)
                let symbol = isSum ? '+' : '-'
                let parts = [this.parts(el, ':', true)[index], this.parts(next, ':', true)[index]]
                let flag = eval(`${parts[1]}${symbol}${parts[0]}`) % num === 0

                if (flag) {
                    result = result[result.length - 1] === el ? [...result, next] : [...result, el, next]
                }
            }
        })

        return result
    }

    nearestBaseOfNumPower(num = 1, power = 2) {
        let result = 1

        while (result**power < num) {
            result++
        }

        result--

        return result
    }

    filterYearsByMultiplicitySubsequence(list = [], numbers = []) {
        let result = []
        let seq = []
        let index = 0

        list.map(el => {
            let num = numbers[index]
            let flag = el % num === 0

            if (flag) {
                seq = [...seq, el]
                
                if (index < numbers.length - 1) {
                    index++
                } else {
                    index = 0
                }

            } else if (!flag && index !== 0) {    
                         
                result = [...result, ...seq]
      
                seq = []
                index = 0
            }
        })

        return result
    }

    filterTimesByAveragePart(list = [], num = 1, min = 1, max = 1, isMinutes = true) {
        let index = Number(isMinutes)
        let result = []
        let sum = 0

        list.map(el => {
            let part = this.parts(el, ':', true)[index]
            let average = result.length !== 0 ? Math.round((sum + part) / (result.length + 1)) : part
 
            if (result.length < num && average >= min && average <= max) {              
                sum += part
                result = [...result, el]
            }            
        })

        return result
    }

    findYearsByMultiplicityOnDistance(year = 1e3, border = 1e1, num = 1) {
        let max = year + border
        let result = []
        
        year = Math.floor(year / num) * num

        while (year < max) {
            result = [...result, year]
            year += num
        }

        return result
    }

    getNumTask(num = 1, symbol = '+') {
        let result = ''
        let first, second

        if (symbol === '*') {
            first = Math.floor(Math.random() * num)
            second = num / first

            while (num % second !== 0) {
                first = Math.floor(Math.random() * num)
                second = num / first
            }

        } else if (symbol === '/') {
            first = Math.floor(Math.random() * num**2)
            second = first / num

            while (first % num !== 0) {
                first = Math.floor(Math.random() * num**2)
                second = first / num
            }

        } else {

            first = Math.floor(Math.random() * num)
            
            if (symbol === '-') {
                first += num
            }

            second = Math.abs(num - first)
        }

        result = `${first} ${symbol} ${second}`

        return result
    }

    findNumDigitPercentFromOtherDigit(num = 1e1, digit = 2, other = 1, round = 0) {
        let value = this.getYearDigit(num, digit) * 1e1**(digit - 1)
        let toCompare = this.getYearDigit(num, other) * 1e1**(other - 1)
        let result = this.percent(value, toCompare, round) 

        return result
    }

    filterTimesByPartsResidue(list = [], num = 1, residue = 1, isMinutes = true) {
        const index = Number(isMinutes)
        let result = []

        list.map(el => {
            if (this.isTime(el)) {
                let part = this.parts(el, ':', true)[index]

                if (part % num === residue) {
                    result = [...result, el]
                }
            }
        })

        return result
    }

    yearsByMultipleStep(year = 1e3, max = 1e1, num = 1, step = 1) {
        let result = []

        for (let i = 0; i < num; i++) {
            let value = year + this.getIntervalValue([1, max]) * step
       
            result = [...result, value]
        }

        return result
    }

    findNearestNumByMultiplicity(num = 1, times = 1, multiple = 1) {
        let result = Math.floor(num * times)

        result = Math[result % multiple < Math.round(multiple / 2) ? 'floor' : 'ceil'](result / multiple) * multiple

        return result
    }

    findSmallestNumByMultipleList(list = []) {
        let result = 1

        for (let i = 0; i < list.length; i++) {
            let num = list[i]

            if (result % num !== 0) {
                result *= num
            }
        }

        return result
    }

    timeByPartsMultiplicity(nums = []) {
        let result = []

        timePartsBorders.map((el, idx) => {
            let num = nums[idx]
            let border = Math.floor(el / num)
            let value = this.getIntervalValue([1, border]) * num 

            result = [...result, value]
        })

        result = result.map(el => this.rounding(el)).join(':')

        return result
    }

    filterYearByDigitsDifference(year = 1e3, digits = [], min = 1, max = 1e1) { 
        let difference = 0
        let result = true

        digits.map((el, idx) => {
            let current = this.getYearDigit(year, el)
            let next = this.getYearDigit(year, digits[idx + 1])

            if (next) {
                difference += Math.abs(current - next)
            }
        })

        result = difference >= min && difference <= max
        
        return result
    }

    findNearestTimeMultiplicityPart(time = '', num = 1, isMinutes = true) {
        let result = 0

        if (this.isTime(time)) {
            let parts = this.parts(time, ':', true)
            let current = parts[Number(isMinutes)]
            let next = parts[Number(!isMinutes)]

            let value = Math[current % num < Math.round(num / 2) ? 'floor' : 'ceil'](current / num) * num
        
            result = isMinutes ? next * 6e1 + value : value * 6e1 + next
        }

        result = this.time(result)

        return result
    }
    
    filterYearsByResidueDeviation(list = [], num = 5e1, size = 1e1) {
        const borders = [num - size, num + size]
        let result = []

        list.map(el => {
            let value = el % 1e2
            let flag = value >= borders[0] && value <= borders[1]
       
            if (flag) {
                result = [...result, el]
            }
        })

        return  result
    }

    findAverageYearsDeviation(list = [], num = 1) {
        let result = 0

        list.map(el => {
            let value = el % 1e2
            let difference = Math.abs(value - num)

            result += difference
        })

        result = Math.round(result / list.length)

        return result
    }

    findAverageTimePart(list = [], isMinutes = true) {
        let result = 0

        list.map(el => {
            if (this.isTime(el)) {
                let part = this.parts(el, ':', true)[Number(isMinutes)]

                result += part
            }
        })

        result = Math.round(result / list.length)

        return result
    }

    changeYearsByNearestResidueMultiplicity(list = [], num = 1) {
        const half = Math.round(num / 2)
        let result = list

        result = result.map(el => {
            let residue = el % 1e2
            let value = el - residue

            residue = Math[residue % num <= half ? 'floor' : 'ceil'](residue / num) * num
            value += residue

            return value
        })

        return result
    }

    getNumDigitFactorial(num = 1) {        
        let length = String(num).length
        let index = 1
        let result = 1
    
        while (index <= length) {
            let digit = this.getYearDigit(num, index)
            let flag = Boolean(digit)
            
            result = flag ? result * digit : digit
            index = flag ? index + 1 : length   
        }

        return result
    }

    yearsByRandomlySchemaDeviation(year = 1e3, schema = [], forward = 1e1, back = forward) {
        let result = []

        schema.map(el => {
            let value = this.getIntervalValue([0, el ? forward : back])
            
            value = el ? year + value : year - value

            result = [...result, value]
        })

        return result
    }

    getNumSequence(list = [], isIncrease = true) {
        let result = []
        let latest = Math[isIncrease ? 'min' : 'max'](...list)

        list.map(el => {
            let flag = isIncrease ? el >= latest : el <= latest

            if (flag) {
                result = [...result, el]
                latest = el 
            }
        })

        return result
    }

    filterTimesByNearestPart(list = [], num = 1e1, difference = 0, isMinutes = true) {
        let result = ''

        list.map(el => {
            let value = this.parts(el, ':', true)[Number(isMinutes)]
            let size = Math.abs(num - value)

            if (size <= difference) {
                result = [...result, el]
            }
        })

        return result
    }
    
    splitNum(num = 1, digit = 1) {
        let result = []           
        let value = 0

        for (let i = 1; i <= digit; i++) {
            value += this.getYearDigit(num, i) * 1e1**(i - 1)
        }

        result = [value, num - value]

        return result
    }

    joinNum(list = [], iterations = 1, power = 2) {
        let result = 0

        for (let i = 0; i < iterations; i++) {
            let value = list[Math.floor(Math.random() * list.length)]
            let extent = this.getIntervalValue([0, power])
    
            result += value * 1e1**extent
        }

        return result
    }

    filterTimesByDynamicDifference(list = [], min = 0, max = 1e1, round = 0) { 
        const key = 'deconvert'
        let result = []

        list.map((el, idx) => {
            let next = list[idx + 1]

            if (next) {
                let distance = this.time(this.timeDistance(el, next), key)
                let difference = this.percent(distance, this.time(el, key), round) 
             
                if (difference >= min && difference <= max) {
                    result = result[result.length - 1] === el ? [...result, next] : [...result, el, next]
                }
            }
        })

        return result
    }

    filterYearsByCenturyDifference(list = []) {
        let result = []

        list.map((el, idx) => {
            let next = list[idx + 1]

            if (next) {
                let latest = result[result.length - 1]
                let current = Math.ceil(el / 1e2)
                let difference = Math.abs(current - Math.ceil(next / 1e2))
            
                if (Boolean(difference) && Math.ceil(latest / 1e2) !== current) {
                    result = latest === el ? [...result, next] : [...result, el, next]
                }
            }
        })

        return result
    }

    getNumByDigit(num = 1) {
        let result = 0

        for (let i = 0; i < num; i++) {
            result += this.getIntervalValue([Number(i === 0), 9]) * 1e1**i
        }

        return result
    }

    factorizeNum(num = 1, size = 1, min = 1, max = 1) {
        let result = []

        for (let i = 0; i < size; i++) { 
            let value = this.getIntervalValue([min, max])
          
            while (num % value !== 0) {
                value = this.getIntervalValue([min, max])
            }

            result = [...result, value]
            num /= value
        }

        return result
    }

    sortYearsByResidue(list = [], isIncrease = true) {
        let result = []
        let residue = isIncrease ? 0 : 1e2
        
        list.map(el => {
            let value = el % 1e2
            let flag = isIncrease ? value >= residue : value <= residue
            
            if (flag) {
                result = [...result, el]
                residue = value
            }
        })

        return result
    }

    findNumNearestPowerDifference(num = 1, power = 2, isPrev = true, round = 0) {
        const square = num**power
        let result = [num - 1, num + 1]

        result = result.map(el => el**power).map(el => Math.abs(square - el))
        
        result = this.percent(result[Number(!isPrev)], result[Number(isPrev)], round)

        return result
    }

    findAverageTimesGap(list = [], marker = 1e3) {
        let result = 0
        let num = 0

        list.map(el => {
            if (this.isTime(el)) {
                let gap = Math.abs(marker - this.time(el, 'deconvert')) 

                result += gap
                num++
            }
        })

        result = Math.round(result / num)

        return result
    }

    findNumDeviationPercent(list = [], num = 1, isMore = true, round = 0) {
        let difference = Math.abs(Math.max(...list) - Math.min(...list))
        let value = Math.abs(Math[isMore ? 'max' : 'min'](...list) - num)
        let result = this.percent(value, difference, round)

        return result
    }

    filterNumByDifferenceMultiplicity(list = []) {
        let result = []

        list.map((el, idx) => {
            let next = list[idx + 1]

            if (next) {
                let difference = Math.abs(next - el)

                if (!Boolean(next % difference) && !Boolean(el % difference)) {
                    result = result[result.length - 1] === el ? [...result, next] : [...result, el, next]
                }
            }
        })

        return result
    }

    filterYearsByResidueMultiplicityOnCentury(list = []) {
        let result = []

        list.map(el => {
            let residue = el % 1e2
            let century = Math.floor(el / 1e2)

            if (residue % century === 0) {
                result = [...result, el]
            }
        })

        return result
    }

    filterTimesByMinutePartChangingByGap(list = [], num = 1e1, min = 0, max = 1e2, isAddition = true) {
        let result = []

        list.map(el => {
            let value = this.time(el, 'deconvert')
            let minutes = value % 6e1

            value = isAddition ? value + num : value - num

            let part = this.parts(this.time(value), ':', true)[1]
            let difference = this.percent(part, minutes, 0)
            
            if (difference >= min && difference <= max) {
                result = [...result, el]
            }
        })

        return result
    }

    yearsByMultiplicityInterval(min = 1e3, max = 2e3, num = 1) {
        let result = []

        min = Math.ceil(min / num) * num

        while (min < max) {
            result = [...result, min]
            
            min += num            
        }

        return result
    }

    findNumResiduePercent(num = 1, divider = 1, round = 0) {
        let result = this.percent(num % divider * divider, num, round) 

        return result
    }

    timestampsByRadomlyDeviation(time = '', num = 1, radius = 1e1, isIncrease = true) {
        const base = this.time(time, 'deconvert')
        let result = []

        for (let i = 0; i < num; i++) {
            let value = this.getIntervalValue([0, radius])

            value = isIncrease ? base + value : base - value

            result = [...result, this.time(value)]
        }

        return result
    }

    countNumDigit(num = 1, digit = 1) { 
        let flag = true
        let latest = 1
        let counter = 1
        let result = 0
                
        while (flag) {
            let value = this.getYearDigit(num, counter)

            if (value === digit) {
                result++
            }

            if (value !== 0) {
                latest = value
            } else {
                latest--
            
                flag = Boolean(latest)
            }
           
            counter++
        }

        return result
    }

    filterYearsByQuarterSchema(list = [], schema = []) {
        let result = []
        let index = 0

        list.map(el => {
            let quarter = Math.ceil(el % 1e2 / 25)

            if (schema[index] === quarter) {
                result = [...result, el]
                index++
            }
        })

        return result
    }

    findNumSymmentry(list = [], round = 0) {
        const length = list.length

        let index = Math.floor(length / 2)
        let result = 0

        for (let i = 0; i < index; i++) {
            let left = list[i]
            let right = list[length - i - 1]
            
            let difference = Math.abs(left - right)
         
            difference = this.percent(difference, right < left ? right : left, round)
   
            result += difference 
        }   

        result = 1e2 - Math.round(result / index)

        return result
    }

    findTimeBorders(list = []) {
        let result = [minutesMax, 0]
        
        list.map(el => {
            if (this.isTime(el)) {
                let value = this.time(el, 'deconvert')

                if (value > result[1]) {
                    result[1] = value
                } else if (value < result[0]) {
                    result[0] = value
                }
            }
        })

        result = result.map(el => this.time(el))

        return result
    }

    findNumRowDispersion(list = []) {
        let result = 1e6
        let pointer = 0

        list.map(el => {
            if (el > pointer) {
                pointer = el 
            } else if (el < result) {
                result = el
            }
        })

        result = Math.round(pointer / result)

        return result
    }

    convertYearResidueIntoGap(year = 1e3) {
        let result = Math.floor(year / 1e2) * 1e2 + (1e2 - year % 1e2)

        return result
    }

    mixNumList(list = []) {
        let result = new Array(list.length).fill(null)

        list.map((el, idx) => {
            let index = Math.floor(Math.random() * list.length)

            while (result[index] !== null || index === idx) {
                index = Math.floor(Math.random() * list.length)
            }

            result[index] = el
        })

        return result
    }

    findPercentOfTime(time = '', round = 0) {
        let result = 0

        if (this.isTime(time)) {
            result = this.time(time, 'deconvert')
            result = this.percent(result, minutesMax, round)
        }

        return result
    }

    findNumListAverageDeviation(list = [], num = 1, isMore = null) {
        let result = 0
        let counter = 0

        list.map(el => {
            let difference = Math.abs(el - num)
            let flag = isMore && el >= num || !isMore && el <= num || isMore === null

            if (flag) {
                result += difference
                counter++
            }            
        })

        result = Math.round(result / counter)

        return result
    }

    findYearsSubsequenceByAverageResidue(list = [], num = 1e1, fault = 0, round = 0) {
        const delta = this.cleanValue(fault, num, round)
        const borders = [num - delta, num + delta]

        let result = []
        let value = 0

        list.map(el => {
            let residue = el % 1e2
            let volume = Math.round((value + residue) / (result.length + 1))
     
            if ((volume >= borders[0] && volume <= borders[1]) || result.length === 0) {
                result = [...result, el]
                value += residue
            } 
        })

        if (result.length === 1) {
            result = []
        }

        return result
    }

    findNearestNumByPairsMultiplication(list = [], num = 1) {
        let change = num
        let result = 0

        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list.length; j++) {
                let current = list[i]
                let next = list[j]

                if (i !== j) {
                    current *= next

                    let difference = Math.abs(current - num)

                    if (difference < change) {
                        result = current
                        change = difference
                    }
                }
            }
        }

        return result
    }

    checkTimePartsByOneDigitDifference(time = '') {
        let result = true

        if (this.isTime(time)) {
            let parts = this.parts(time, ':', true)
            let difference = Math.abs(parts[0] - parts[1])

            if (difference !== 1 && difference !== 1e1) {
                result = false
            }
        }

        return result
    }

    numDivisionOnDigit(num = 1, digit = 1) {
        let value = this.getYearDigit(num, digit) * 1e1**(digit - 1)
        let result = Math.round(num / value)

        return result
    }

    findYearsSubseqenceByDeviationSchema(list = [], num = 1e3, schema = []) {
        let result = []
        let index = 0

        list.map(el => {
            let isMore = schema[index]

            if (isMore && el >= num || !isMore && el <= num) {
                result = [...result, el]
                index++
            }
        })

        return result
    }

    inverseNum(num = 1) {
        const text = String(num)
        const length = text.length

        let result = 0

        for (let i = 0; i < length; i++) {
            let digit = Number(text[i])
          
            if (digit !== 0) {
                result += (1e1 - digit) * 1e1**(length - i - 1)
            }
        }

        return result
    }

    getNumByRandomlyDigit(num = 1, digit = 1) {
        const length = String(num).length
        let result = 0

        for (let i = 0; i < length; i++) {
            let index = length - i
            let value = digit === index ? this.getIntervalValue([Boolean(digit) ? 0 : 1, 9]) : this.getYearDigit(num, index)

            result += value * 1e1**(index - 1)
        }

        return result
    }

    yearsResidueBorders(list = []) {
        let min = list[0]
        let max = 0
        let result
        
        list.map(el => {
            let value = el % 1e2

            if (value > max % 1e2) {
                max = el
            } else if (value < min % 1e2) {
                min = el
            }
        })

        result = [min, max]

        return result
    }

    getNumPairs(list = [], isIncrease = null) {
        let result = []

        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list.length; j++) {
                let current = list[i]
                let next = list[j]

                let flag = isIncrease && current < next || !isIncrease && current > next || isIncrease === null

                if (flag) {
                    result = [...result, [current, next]]
                }
            }
        }

        return result
    }

    lexisTime(time = '') {
        let result = ''
    
        if (this.isTime(time)) {
            let parts = this.parts(time, ':', true)
            let isQuarter = parts[1] >= 15 && parts[1] % 15 === 0

            if (isQuarter) {
                result = `${Math.floor(parts[1] / 15)} quarters after ${parts[0]} hours`
            } else {
                if (Math.abs(6e1 - parts[1]) < 15 || parts[1] < 15) {
                    let isMore = parts[1] > 3e1
                    let difference = isMore ? 6e1 - parts[1] : parts[1]

                    result = `${difference} minutes ${isMore ? 'before' : 'after'} ${isMore ? parts[0] + 1 : parts[0]} hours`
                } else {
                    result = `${parts[0]} hours and ${parts[1]} minutes`
                }
            }
        }

        return result
    }

    discardNumDigits(num = 1, digit = 1) {
        let result = num
        
        for (let i = 1; i <= digit; i++) {
            let value = this.getYearDigit(num, i)

            result -= value * 1e1**(i - 1)
        }

        return result
    }

    nearestPowerOfNumAndBase(num = 1, base = 1, accuracy = 1) {
        const value = 1e1**(- accuracy)
        let result = 1
    
        while (base**result <= num) {
            result++
        }
       
        result--

        while (base**result < num) {
            result += value
        }

        result -= value

        result = this.toRound(result, accuracy)

        return result
    }

    transformYearsResidue(list = [], ratio = 1) {
        let result = []

        result = list.map(el => {
            let value = el % 1e2

            value = Math.floor(value * ratio)

            return Math.floor(el / 1e2) * 1e2 + value
        })

        return result
    }

    filterTimesBySchema(list = [], schema = '', marker = 'x') {
        let result = []

        list.map(el => {
            let flag = true

            String(el).split('').map((item, idx) => {
                let toCompare = schema[idx]

                if (flag && toCompare !== marker) {
                    flag = item === toCompare
                }
            })

            if (flag) {
                result = [...result, el]
            }
        })

        return result
    }

    getNumMultiplicationPairs(num = 1) {
        const border = Math.floor(num / 2)

        let result = []
        let pointer = 1
        
        while (pointer < border) {
            let residue = num % pointer === 0

            if (residue) {
                result = [...result, [pointer, num / pointer]]
            }

            pointer++
        }

        return result
    }
}

module.exports = Core