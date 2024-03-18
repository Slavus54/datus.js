const {weekdays, months, minutesMin, minutesMax, periods} = require('./src/data')
const Datus = require('./src/Core')

const weekdaysTitles = weekdays.map(el => el.title)
const weekdaysTags = weekdays.map(el => el.tag)

module.exports = {Datus, weekdaysTitles, weekdaysTags, months, minutesMin, minutesMax, periods} 