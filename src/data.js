let months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

let weekdays = [
    {
        title: 'Monday',
        tag: 'Mon'
    },
    {
        title: 'Tuesday',
        tag: 'Tue'
    },
    {
        title: 'Wednesday',
        tag: 'Wed'
    },
    {
        title: 'Thursday',
        tag: 'Thu'
    },
    {
        title: 'Friday',
        tag: 'Fri'
    },
    {
        title: 'Saturday',
        tag: 'Sat'
    },
    {
        title: 'Sunday',
        tag: 'Sun'
    }
]

let base = 60**2 * 24 * 1000

let sizes = [
    {
        title: 'second',
        value: base / 86400
    },
    {
        title: 'minute',
        value: base / 1440
    },
    {
        title: 'hour',
        value: base / 24
    },
    {
        title: 'day',
        value: base
    },
    {
        title: 'week',
        value: base * 7
    },
    {
        title: 'decade',
        value: base * 10
    },
    {
        title: 'month',
        value: base * 30
    },
    {
        title: 'quarter',
        value: base * 90
    },
    {
        title: 'year',
        value: base * 365
    }
]

let timeMeasures = [
    {
        content: 'ms',
        value: 1
    },
    {
        content: 's',
        value: 1e3
    },
    {
        content: 'm',
        value: 6e4 
    },
    {
        content: 'h',
        value: 36e5
    }
]

let day_parts = [
    {
        title: 'Night',
        border: 300
    },
    {
        title: 'Morning',
        border: 600
    },
    {
        title: 'Noon',
        border: 960
    },
    {
        title: 'Afternoon',
        border: 1080
    },
    {
        title: 'Dusk',
        border: 1200
    },
    {
        title: 'Evening',
        border: 1320
    },
    {
        title: 'Midnight',
        border: 1440
    }
]

const solarSystemPlanets = [
    {
      name: 'Mercury',
      dayDuration: 4194.8
    },
    {
      name: 'Venus',
      dayDuration: 2802
    },
    {
      name: 'Earth',
      dayDuration: 24
    },
    {
      name: 'Mars',
      dayDuration: 24.7
    },
    {
      name: 'Jupiter',
      dayDuration: 9.9
    },
    {
      name: 'Saturn',
      dayDuration: 10.7
    },
    {
      name: 'Uranus',
      dayDuration: 17.2
    },
    {
      name: 'Neptune',
      dayDuration: 16.1
    }
]

const zodiacSigns = ['Rat', 'Bull', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Hourse', 'Goat', 'Monkey', 'Cock', 'Dog']
const ageBorders = ['0+', '3+', '6+', '12+', '16+', '18+', '21+']

const abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm']
const specs = ['$', '^', '&', '@', '#', '~']
const operations = ['+', '-', '*', '/']
const datePeriods = ['day', 'month', 'year']
const timePeriods = ['hour', 'minute']

const time_start = '00:00'
const monthSize = 29.53
const minutesMin = 0
const minutesMid = 720
const minutesMax = 1440
const timePartsBorders = [23, 59]
const timePartsLimits = [24, 60]
const datePartsBorders = [31, 12, 21e2]
const msDividers = [36e5, 6e4, 1e3, 1]

let seasons = ['Winter', 'Spring', 'Summer', 'Autumn']
let basic_value = sizes[0].value
let binary_check_items = [[3, 5], [4, 3, 11]] 
let date_sizes = [1, monthSize, 365]
let time_sizes = [60, 1]
let initial_date_parts = [1, 1, 1970]
let timePosition = 2

module.exports = {basic_value, weekdays, months, sizes, minutesMin, minutesMid, minutesMax, time_start, base, binary_check_items, monthSize, seasons, day_parts, date_sizes, initial_date_parts, time_sizes, zodiacSigns, solarSystemPlanets, abc, specs, operations, datePeriods, timePeriods, timePartsBorders, timePartsLimits, datePartsBorders, timeMeasures, timePosition, msDividers, ageBorders}