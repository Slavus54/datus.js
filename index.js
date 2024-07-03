const {weekdays, months, minutesMin, minutesMax, seasons, day_parts, sizes, timeMeasures} = require('./src/data')
const Datus = require('./src/Core')

const weekdaysTitles = weekdays.map(el => el.title)
const weekdaysTags = weekdays.map(el => el.tag)
const dayParts = day_parts.map(el => el.title)
const periods = sizes.map(el => el.title)

module.exports = {Datus, weekdaysTitles, weekdaysTags, dayParts, months, minutesMin, minutesMax, periods, seasons, timeMeasures} 