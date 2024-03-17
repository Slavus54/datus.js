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
        title: 'month',
        value: base * 30
    },
    {
        title: 'year',
        value: base * 365
    }
]

let rome_nums = [
    {
        title: 'I',
        value: 1
    },
    {
        title: 'V',
        value: 5
    },
    {
        title: 'X',
        value: 10
    },
    {
        title: 'L',
        value: 50
    },
    {
        title: 'C',
        value: 100
    },
    {
        title: 'D',
        value: 500
    },
    {
        title: 'M',
        value: 1000
    }
]

let basic_value = sizes[0].value
const date_filters = ['day', 'month', 'year']

const time_start = '00:00'
const minutesMin = 0
const minutesMid = 720
const minutesMax = 1440

module.exports = {basic_value, weekdays, months, sizes, minutesMin, minutesMid, minutesMax, time_start, base, date_filters, rome_nums}