## Datus.JS - small library on JS with date management methods 

### Getting Started

import Datus from 'datus.js'** or **const Datus = require('datus.js')

Examples

```
    let datus = new Datus()
    let size = 0
    let date = datus.move()

    ...

    btn.addEventListener('click', () => {
        size += 1
        date = datus.move('day', '+', size) - update date with next day
    })
    
```

```
    // today is Wednesday

    let datus = new Datus()
    let cards = [{name: 'Petr', day: 'Monday'}, {name: 'Sasha', day: 'Wednesday'}]
    let today_size = 0

    cards.map(el => {
        if (datus.gap('Wednesday') === 0) {
            today_size += 1
        }
    })
```

### Versions and CI/CD

1.0.0 - basic library publishing

1.0.2 - created gap() method to look number of days before weekday, updated index getter (EU format of week beginning) and created README.md

1.0.3 - added weekdays API and updated README.md

1.0.4 - updated import 

1.0.5 - 1.0.6 - created filter(date, period, value) and difference(date, lock, side) methods to manage/filter items with dates and get days before/after event

1.0.7 - updated weekdays and added months API with keey words *weekdays_titles, weekdays_tags, months_titles*

1.0.8 - huge update with new methods *day()* to get hours, minutes or seconds until the end / after beginning of day, *time()* to convert/deconvert time by minutes.

1.0.9 - refactored, added to *difference()* method third argument "flag" (days convert into time measure week/month/year), *time()* gain third argument isTwelve to see time in US/EU formats.

1.1.0 - added *times(start, period, num)* method to generate an array of converted times until 00:00, start in HH:MM format, period in minutes and num is an integer value.

1.1.1 - updated *filter()*, added new method *random(isTime, num)* creates an array of times or dates (in past) randomly and method *range(dates, period)* that returns range of numbers by days/months/years.

1.1.2 - created new methods to work with Roman numerals, century picker and current date formatting: *convert(), border(), century() and timestamp()*.

### Documentation

Learn more on *https://github.com/Slavus54/datus.js*