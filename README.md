## Datus.JS 1.1.5       

*https://www.npmjs.com/package/datus.js* - npmjs             

*https://github.com/Slavus54/datus.js* - github repository
 

### Description             

Small library to manage date and time with several formats without pain.            
Killer of *Moment.js*                   

### Getting Started     

import {Datus} from 'datus.js' or const {Datus} = require('datus.js')    

const datus = new Datus()             

Datus.js API importing to improve your experience         

~~~

import {weekdaysTitles, weekdaysTags, months, minutesMin, minutesMax, date_filters} from 'datus.js'    
    
~~~

### Examples

~~~ 

    let counter = 0  
    let date = datus.move() // initial date         
    <button onClick={() => {date = datus.move('day', '+', counter)}}>Next</button> // 7 clicks and event will be week later  

~~~

~~~

    let currentOrder = { title: 'Pizza Mozzarella 32cm', name: 'Mark', timestamp: 623 } // Julia works until 12:00, does she pick up an order?        
    let check: boolean = currentOrder.timestamp <= datus.time('12:00', 'deconvert') // yes, Mark won't go hungry    

~~~

~~~

    let events = [{title: 'Battle of Marengo', date: '14.06.1800'}, {title: 'Battle of Austerlitz', date: '02.12.1805'}]        
    let filteredEvents = events.filter(el => datus.filter(el.date, 'month', 12)) // filtered battles, which were in December 

~~~

### Methods     

-**move** (*flag* = 'day', *direction* = '+', *num* = 0) - run through the calendar in all directions, return date.    

-**gap** (*weekday* = null, *key* = 'tag') - return difference between weekday and today in days, key parameter is a variant of day calling (tag or title).     

-**dates** (*flag* = 'week', *num* = 2, *weekday* = null) - create an array of dates since weekday (today by default) with time period iterations by *flag* ('day', 'week' or 'month'). *num* is a number of dates.     

-**filter** (*date*, *period* = 'day', *check* = '') - compare integer value of date's period ('day', 'month' or 'year') with condition *check* and return true/false.         

-**difference** (*date*, *side* = '+', *flag* = 'day', *lock* = 10) - find difference in *flag* time period (by default days) between today and date in past or future (by *side* parameter). *lock* is a integer limit of inside date iterations to compare with *date*.     

-**day** (*key* = 'start', *size* = 'hour') - returned number of hours/minutes/seconds after day starts (*key* = 'start') or until its end (*key* = 'end').     

-**time** (*value* = null, *key* = 'convert', *isTwelve* = false) - received *value* in minutes and convert it to HH:MM format, or if *key* equal 'deconvert' it returned number of minutes. Flag *isTwelve* is for US time format.    

-**times** (*start* = '00:00', *period* = 30, *num* = 10) - returned array of timestamps in HH:MM format beginning from *start* time with *period* in minutes, *num* - size of array.     

-**random** (*isTime* = true, *num* = 5) - returned array of random dates (last 30 days) or times in HH:MM format.         

-**range** (*dates* = [], *period* = 'day') - returned difference between smallest and largest integer value of date's period ('day', 'month' or 'year') in array of unsorted dates.        

-**convert** (*value* = null, *key* = 'convert') - convert Arabic number to Roman and reverse, return string by default or number.             

-**border** (*num* = null, *isRome* = false) - receives century (number Arabic or string Roman) and returns array of first and last year of century.    

-**century** (*year* = 1000, *isRome* = false) - return century in Roman/Arabic format by year (number).        

-**timestamp** (*format* = 'all', *divider* = '|) - returns current date or time and divides it by second parameter.      

-**utc** - returns Promise with european towns's timezones.     

-**distinction** (*time* = '', *utc* = 0, *isNum* = true) - counts difference it time between utc event and now; returns object with distinction in format (*number of minutes* or *text*) and flag {result, isGone}.          

-**palindrom** (*value* = '', *isDate* = true) - check if date or time is palindrom and return true/false.    

-**exchange** (*num* = 10, *from* = 'minute', *to* = 'hour') - receives value in first period and exchange it for second.    

-**clock** (*value* = 10, *arrow* = 'hour', *isPositive* = true) - returns degrees between 3 a.m. and hour/minute arrows by value in minute on clock.           

-**formula** (*start* = '12:00', *duration* = 0, *body* = 'x + y - 1', *size* = 'minute') - substitution into formulas body *start* to x and *duration* to y, return result as time string.     

-**format** (*value* = '', *key* = 'default', *isDate* = true) - formatting and returns date and time  by *key*: 'letter' for date and 'us' for time. Add special class for validation very soon.   

-**part** (*num* = 0, *size* = 'day') - returns % of year (check for leap year) for any period.      

-**duration** (*distance* = 10, *speed* = 1, *size* = 'hour') - solves problem to count duration in any format when we have distance (in km) and speed (km/h).