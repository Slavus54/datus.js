# Datus.JS       

## Description             

JavaScript library to handling, parsing, validation and formatting date or time.      

* Light and powerful analogue of **Moment.js**                           
* Current Version: **1.4.6**
* Size ~ **70 kB**
* Most of algorithms have **O(n)** time complexity

## Links

To download - *https://www.npmjs.com/package/datus.js* 

To look code - *https://github.com/Slavus54/datus.js* 

## History

When I had been building web apps on React since 2020 I used to manipulate dates with heavy and powerful library **Moment.js**   
g
I've met a lot of issues and limits working with it and decided to create something to use instead it on **JavaScript**   

Now I'm looking for new features and hope you can help me and other developers to have great experience of building library and using these methods in your projects for free.

## Getting Started         
~~~
import {Datus, weekdaysTitles, weekdaysTags, dayParts, months, minutesMin, minutesMax, periods, seasons, timeMeasures} from 'datus.js'     

const datus = new Datus() // declare an instance of class              
~~~
## Examples

~~~ 
    const [date, setDate] = useState<string>(datus.now('date'))  
    const [days, setDays] = useState<number>(0)  
    
    useEffect(() => {      
        let result = datus.move('day', '+', days)  // method to generate new date 
        
        setDate(result)  
    }, [days])    
    
    <span>When I will have learned English: {date}</span>      
    
    <button onClick={() => setDays(days + 1)}>Another Day<button>        
~~~

~~~
    const border = 1140 // 19:00            
    const deadline = '01.01.1970' // IPhone's nightmare     
    const distanceSize = 7 // one week    
    
    let orders = [{title: '', time: 'HH:MM', date: 'DD.MM.YYYY'} and 1e3 of items]      
    
    orders = orders.filter(el => datus.time(el.time, 'deconvert') <= border)        
    
    let nearestOrders = orders.filter(el => datus.distance(el.date, deadline) <= distanceSize)    
~~~

~~~
    let time_start = '12:30'        
    let time_end = '18 hours 15 minutes'        
    
    // let's check these times
    
    console.log(datus.isTime(time_start)) // true      
    console.log(datus.isTime(time_end)) // false    
~~~

## Methods     

-**move** (*flag* = 'day', *direction* = '+', *num* = 0) - run through the calendar in all directions, return date.    

-**gap** (*weekday* = null, *key* = 'tag') - return difference between weekday and today in days, key parameter is a variant of day calling (tag or title).     

-**dates** (*flag* = 'week', *num* = 2, *weekday* = null) - create an array of dates since weekday (today by default) with time period iterations by *flag* ('day', 'week' or 'month'). *num* is a number of dates.     

-**filterByValue** (*date* = '22.02.2024', *period* = 'day', *value* = 22) - filter date by period with int value and return true/false.            

-**difference** (*date*, *flag* = 'day', *lock* = 10) - find difference in *flag* time period (by default days) between today and date in past or future. *lock* is a integer limit of inside date iterations to compare with *date*.     

-**day** (*key* = 'start', *size* = 'hour') - returned number of hours/minutes/seconds after day starts (*key* = 'start') or until its end (*key* = 'end').     

-**time** (*value* = null, *key* = 'convert', *isTwelve* = false) - received *value* in minutes and convert it to HH:MM format, or if *key* equal 'deconvert' it returned number of minutes. Flag *isTwelve* is for US time format.    

-**times** (*start* = '00:00', *period* = 30, *num* = 10) - returned array of timestamps in HH:MM format beginning from *start* time with *period* in minutes, *num* - size of array.     

-**range** (*dates* = [], *period* = 'day') - returned difference between smallest and largest integer value of date's period ('day', 'month' or 'year') in array of unsorted dates.        

-**convert** (*value* = null, *key* = 'convert') - convert Indian number to Roman and reverse, return string by default or number.             

-**border** (*num* = null, *isRome* = false) - receives century (number Indian or string Roman) and returns array of first and last year of century.    

-**century** (*year* = 1000, *isRome* = false) - return century in Roman/Indian format by year (number).        

-**now** (*format* = 'all', *divider* = '') - returns current date or time and divides it by second parameter.      

-**utc** - returns Promise with european towns's timezones.     

-**distinction** (*time* = '', *utc* = 0, *isNum* = true) - counts difference time between utc event and now; returns object with distinction in format (*number of minutes* or *text*) and flag {result, isGone}.  

-**event** (*time* = '12:00', *duration* = 90, *utc* = 1) - returns number of events that can be completed before utc time (by default CET).       

-**palindrom** (*value* = '', *isDate* = true) - check if date or time is palindrom and return true/false.    

-**binary** (*value* = '', *isDate* = true) - check if each parts of date or time is equal 2**power (binary) and return true/false. 

-**exchange** (*num* = 10, *from* = 'minute', *to* = 'hour') - receives value in first period and exchange it for second.       

-**clock** (*value* = 10, *arrow* = 'hour', *isPositive* = true) - returns degrees between 3 a.m. and hour/minute arrows by value in minute on clock.           

-**formula** (*start* = '12:00', *duration* = 0, *body* = 'x + y - 1', *size* = 'minute') - substitution into formulas body *start* to x and *duration* to y, return result as time string.      

-**sequence** (*start* = '12:00', *interval* = 10, *num* = 5, *mask* = ':30') - generates list of times with interval and checking each element on mask.       

-**format** (*value* = '', *key* = 'default', *isDate* = true) - formatting and returns date and time  by *key*: 'letter' for date and 'us' for time.           

-**pointer** (*text* = 'today') - formatting and returns date with word-pointer.             

-**part** (*num* = 0, *size* = 'day') - returns % of year (check for leap year) for any period.      

-**duration** (*distance* = 10, *speed* = 1, *size* = 'hour') - solves problem to count duration in any format when we have distance (in km) and speed (km/h).  

-**period** (*num* = 1e2) - receives number border and returns text of time period with random generated number.         

-**walking** (*value* = 10, *size* = 'minute', *speed* = '*') - received time period and returns number of steps to walking while it.      

-**hash** (*value* = '', *isDate* = true, *multiplier* = 1) - simple hash-function with good avalance effect based on date/time string.        

-**year** (*difference* = 0, *isRome* = false) - returns an object {year, isLeap}, by *difference* parameter you can get more ancient year from Jesus's birthday or Rome's foundation.   

-**months** (*length* = 12, *isTitle* = false) - allows to get an array of months (title or number) since year beginning, slices and returns it in descending order.           

-**nearest** (*time* = '', *arr* = [], *key* = '') - finds among timestamps the most close to given time (after it) and returns it.    

-**bit** (*content* = '', *isDate* = false) - returns converted time/date string parts to binary.       

-**pomodoro** (*time* = '', *num* = 1, *duration* = 25, *pause* = 5, *rest* = 15) - according settings gives array of timestamps of tasks beginning.               

-**info** (*text* = '', *isDate* = true) - returns an object with actual information about time/date.            

-**us** (*content* = '', *isDate* = true, *isRange* = false) - converts time or date into american format.    

-**isWillBe** (*date* = '24.08.2024') - checking and returns true/false by proviso "Date is today or will be in the future".                

-**num** (*digit* = 1) - randomly generates integer 0 <= x <= 8991, choosing multiplier inside method's formula by parameter *digit*.            

-**reading** (*text* = '', *isNum* = true) - returns minutes of text's reading duration in different formats.       

-**cat** (*date* = '', *max* = 100) - converts duration of cat's life (starts by parameter *date*) into human age according life expectancy by parameter *max*.    

-**war** (*size* = 'day') - returns number of days or any other period type by parameter *size* since russian-ukrainian war starts.  

-**zodiac** (*date* = '') - looking for zodiac sign by your birthdate and returns it.         

-**func** (*time* = '12:30', *body* = '', *marker* = 'x') - validates time hours and compared it to minutes by formula.     

-**isWeekend** (*time* = '12:30', *body* = '', *marker* = 'x') - checks and returns if today is Saturday/Sunday.    

-**replace** (*content* = '', *isDate* = true) - swaps time/date parts and returns result.      

-**late** (*time* = '12:30', *deadline* = '12:30', *duration* = 0) - counts % of time waste when you late.    

-**circle** (*radius* = 1, *speed* = 1, *isMeters* = false) - returns time of moving on circle.     

-**generation** (*min* = 2e1, *max* = 3e1, *num* = 5) - counts year when was born the man of *num* generations from the past.  

-**space** (*num* = 1, *size* = 'day', *title* = 'Earth') - converts planet's period (by *num* and *size*) into Earth's days.   

-**encode** (*content* = '', *isDate* = true, *formula* = '(x + 1) / 2', *marker* = 'x') - returns encoded string of date/time by *formula*, contains with letters, numbers and specific symbols.   

-**rate** (*time* = '12:30', *cost* = 1, *round* = 1) - gives information about money which you can earn from now until *time* by hour *rate*.         

-**vacation** (*days* = 0) - returns evenly distributed list of vacation's days per year and period.        

-**endOfMonth** (*date* = '') - counts number of days to end date's month.    

-**capital** (*num* = 1, *period* = 'day', *rate* = 1) - returns earned money for any period by hour rate.        

-**deviation** (*step* = 600, *round* = 0) - counts absolute difference in % between now and *step*.    

-**filterBySchema** (*content* = '', *isDate* = true, *schema* = '', *index* = 0) - check date or time period by running code in *schema*.        

-**similarity** (*content* = '', *isDate* = true, *mask* = '') - compare date/time with *mast* and returns % analogy by cheking each period.    

-**interval** (*time* = 1, *code* = '', *callStack* = 1e3) - runs your code in interval by time limit.     

-**timeout** (*delay* = 0, *code* = '') - runs your code after delay (in seconds).    

-**matrix** (*time* = '', *size* = 1, *step* = 0, *delay* = 30) - builds matrix of times with *step* and *delay* of each matrix row in minutes.  
 
-**percentage** (*time* = '', *round* = 0) - returns an array of rounded numbers, which are % of each time part from its maximum.      

-**dateDistance** (*start* = '', *end* = '', *size* = 'day') - counts difference between 2 dates in *size* and returns it.      

-**isEven** (*content* = '', *isDate* = true) - checking parts of date/time and returns boolean flag items "Is it even ?" + GCD (greatest common divisor).   

-**isTime** (*content*) - validate *content* value on time format HH:MM.    

-**timestamp** (*date* = '', *time* = '') - returns approximate number of ms from 01.01.1970 to *date* and *time*.  

-**activity** (*timestamps* = [], *percent* = '') - returns minutes to complete all timestamps by *percent*.        

-**age** (*birthdate* = '') - counts y.o. of person by date and returns it.      

-**deadlineOfMonth** (*date* = '02.12.1805', *percent* = 5e2, *round* = 0) - returns deadline which counted by *percent* of date's month size.      

-**generator** (*numbers* = [], *isDate* = true) - builds date or time by periods by ratio between each element of *numbers* and sum of them.      

-**percentOfMonth** (*date* = '', *num* = 1, *period* = 'day', *round* = 0) - returns % of remaining days of date's month by *period* and *num*.        

-**capacity** (*date* = '') - returns number as a result of division years of date by period since beginning of year.      

-**change** (*content* = '', *period* = 'month', *num* = 12, *isDate* = true) - rewrites any period of date or time.    

-**id** (*content* = '', *isDate* = true) - generates id from time or date and returns it.    

-**fromArray** (*arr* = []) - returns list of dates built from array's elements.    

-**yearResidue** (*percent* = 0) - returns date generated by % of current year's residue.         

-**summer** (*date* = '', *round* = 0) - returns % of summer period by date.           

-**cigarette** (*time* = '', *num* = 1e1, *round* = 0) - returns how much time you waste of smoking a cigarette. 

-**timeRound** (*time* = '', *num* = 5) - rounds time's minutes by parameter *num* and returns result.      

-**monthDayBorder** (*date* = '', *num* = 1e1) - checks days by parameter *number*  "if it less or equal to days before month end" and returns true/false.   

-**timeByPercent** (*num* = 1e1, *round* = 0) - generated and rounds time by % of it's maximum.     

-**timeByFibonacci** (*num* = 7) - returns time generated by Fibonacci's number as minutes.    

-**dateByPercent** (*percent* = 1e1, *num* = 1e3, *round* = 0) - returns date by % with year *num*.  

-**timeByNumeralSystem** (*num* = 1e1, *system* = 2) - returns time generated by convertation of *num* from *system* to decimal numeral system.  

-**quarter** (*time* = '') - receives time and returns an object with quarter information {quarterNumber, nearestQuarterSize, percent}.  

-**schedule** (*days* = [], *times* = [], *num* = 1) - builds an array of strings "time date" by parameters.    

-**yearsByFormula** (*formula* = '', *length* = 1e1, *marker* = 'x') - creates year by formula with variables with random value from 0 to 9.    

-**yearsByInterval** (*num* = 1, *step* = 1, *border* = this.date.getFullYear(), *isIncrease* = true) - returns list of years with custom *length* built by cycle from *border* increasing/decreasing order by *step*.    

-**weekdayByDate** (*date* = '') - finds weekday by *date* and returns it.          

-**yearsByCentury** (*century* = 21, *decade* = 1) - returns array of 10 items (years) in *century* and *decade*.

-**isNight** (*time* = '') - checks time and returns if it during night.    

-**randomDates** (*num* = 1, *border* = 1e1, *isPassed* = true) - generates list of passed/future dates by parameters.      

-**randomTimes** (*num* = 1, *min* = 0, *max* = minutesMax) - returns list of times by parameters.  

-**track** (*timestamps* = [], *speed* = 7e1, *round* = 0) - counts total duratiopn & distance of track's trip and returns {time, distance}.        

-**timeDistance** (*start* = '', *end* = '') - returns time between 2 borders.  

-**monthAllocation** (*title* = '', *num* = 0, *year* = 2024) - builds list of dates by month's title, year and step of allocation. 

-**timeAllocation** (*start* = '07:00', *end* = '23:59', *num* = 1, *isIncludeEndBorder* = false) - generates list of time by borders with step of allocation.  

-**isUniq** (*content* = '', *isDate* = true) - checks if date/time has uniq digits.        

-**wheel** (*size* = 29, *time* = '00:15', *speed* = 2e1) - finds distance what you passed on bike with wheel's diameter *size* in inch for *time* with speed (km/h).      

-**decadesMonthAllocation** (*days* = [], *title* = '', *year* = 2024) - builds an array of dates with month's decades by number of days in each one.      

-**isDate** (*content* = '') - validates if content is real date - DD.MM.YYYY.    