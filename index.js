const {weekdays, months_titles, time_format_min_border, time_format_max_border, date_filters} = require('./src/data')
const Datus = require('./src/Core')

const weekdays_titles = weekdays.map(el => el.title)
const weekdays_tags = weekdays.map(el => el.tag)

module.exports = {Datus, weekdays_titles, weekdays_tags, months_titles, time_format_min_border, time_format_max_border, date_filters} 