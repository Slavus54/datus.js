let months_titles = [
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

let basic_value = sizes[0].value
const date_filters = ['day', 'month', 'year']

const time_start = '00:00'
const time_format_min_border = 0
const time_format_middle_border = 720
const time_format_max_border = 1440

module.exports = {basic_value, weekdays, months_titles, sizes, time_format_middle_border, time_format_min_border, time_format_max_border, time_start, base, date_filters}