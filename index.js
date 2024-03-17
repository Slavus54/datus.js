const {weekdays, months, minutesMin, minutesMax, date_filters} = require('./src/data')
const Datus = require('./src/Core')

const weekdaysTitles = weekdays.map(el => el.title)
const weekdaysTags = weekdays.map(el => el.tag)

let inst = new Datus()

console.log(inst.part(12, 'day'))
console.log(inst.duration(3486, 60, 'hour'))

module.exports = {Datus, weekdaysTitles, weekdaysTags, months, minutesMin, minutesMax, date_filters} 