# Datus.JS       

## About       

JavaScript library to handling, parsing, validation and formatting date or time.      

* Light, great and powerful analogue of **Moment.js**                           
* Current Version: **1.7.5**
* Size ~ **120 kB**
* Most of algorithms have **O(n)** time complexity
* **2.9K** lines of code and **175 methods**           

## Links

To download - *https://www.npmjs.com/package/datus.js* 

To look code - *https://github.com/Slavus54/datus.js* 

## History

When I had been building web apps on React since 2020 I used to manipulate dates with powerful library **Moment.js**   

I've met a lot of limits working with it and decided to create something to use instead it on **JavaScript**  

Now I'm looking for new features and hope you can help me to have great experience of building this library **for free**.

## Getting Started            

import ***{Datus, weekdaysTitles, weekdaysTags, dayParts, months, minutesMin, minutesMax, periods, seasons, timeMeasures}*** from 'datus.js'     

const datus = new *Datus()*          

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
    
    let nearestOrders = orders.filter(el => datus.dateDistance(el.date, deadline) <= distanceSize)    
~~~

~~~
    let time_start = '12:30'        
    let time_end = '18 hours 15 minutes'        
    
    // let's check these times
    
    console.log(datus.isTime(time_start)) // true      
    console.log(datus.isTime(time_end)) // false    
~~~

~~~
    const WOT_TIERS_LIMIT = 1e1

    let levels = new Array(WOT_TIERS_LIMIT).fill(0).map((_, idx) => datus.convert(idx + 1)) // ['I', 'II', 'III', 'IV',  'V', 'VI', 'VII', 'VIII', 'IX', 'X']
~~~

~~~
    let dates = ['07.05.2021', '02.12.2017', '01.09.2023', '14.03.1906']    

    let days = dates.map(el => datus.dateValue(el)) /// list of days            
~~~
    
## Methods     

There are a lot of methods to work with 5 main chapters of library: *date, time, weekday, year and num*.   

### * Date and Day *

-**move** (*flag* = 'day', *direction* = '+', *num* = 0) - run through the calendar in all directions, return date.   

-**dates** (*flag* = 'week', *num* = 2, *weekday* = null) - create an array of dates since weekday (today by default) with time period iterations by *flag* ('day', 'week' or 'month'). *num* is a number of dates.  

-**difference** (*date*, *flag* = 'day', *lock* = 10) - find difference in *flag* time period (by default days) between today and date in past or future. *lock* is a integer limit of inside date iterations to compare with *date*. 

-**day** (*key* = 'start', *size* = 'hour') - returned number of hours/minutes/seconds after day starts (*key* = 'start') or until its end (*key* = 'end').

-**range** (*dates* = [], *period* = 'day') - returned difference between smallest and largest integer value of date's period ('day', 'month' or 'year') in array of unsorted dates.

-**now** (*format* = 'all', *divider* = '') - returns current date or time and divides it by second parameter.

-**pointer** (*text* = 'today') - formatting and returns date with word-pointer. 

-**dateDistance** (*start* = '', *end* = '', *size* = 'day') - counts difference between 2 dates in *size* and returns it.

-**deadlineOfMonth** (*date* = '02.12.1805', *percent* = 5e2, *round* = 0) - returns deadline which counted by *percent* of date's month size.            

-**percentOfMonth** (*date* = '', *num* = 1, *period* = 'day', *round* = 0) - returns % of remaining days of date's month by *period* and *num*.

-**monthDayBorder** (*date* = '', *num* = 1e1) - checks days by parameter *number*  "if it less or equal to days before month end" and returns true/false.   

-**dateByPercent** (*percent* = 1e1, *num* = 1e3, *round* = 0) - returns date by % with year *num*.

-**randomDates** (*num* = 1, *border* = 1e1, *isPassed* = true) - generates list of passed/future dates by parameters.  

-**monthAllocation** (*title* = '', *num* = 0, *year* = 2024) - builds list of dates by month's title, year and step of allocation. 

-**decadesMonthAllocation** (*days* = [], *title* = '', *year* = 2024) - builds an array of dates with month's decades by number of days in each one.  

-**dateValue** (*date* = '') - returns days of date since beginning of year.

-**dateByParameters** (*dayBorders* = [], *monthBorders* = [], *century* = 21, *decade* = 1) - returns accurately randomly generated date by a lot of parameters.   

-**monthDatesByWeekday** (*date* = '', *weekday* = '') - returns list of dates by *weekday* and month of *date*.

-**dateByYearWeek** (*year* = 2e3, *num* = 1e1) - returns date by *num* of weeks of the *year*. 

-**monthDatesByStep** (*date* = '', *step* = 1) - generates list of dates since *date* with *step* in days throughout the whole date's month.   

-**dateByDays** (*value* = 1e2, *year* = 2024) - builds date by *value* od dates and *year*.    

-**dateByNum** (*num* = 1e3, *round* = 0) - generates date from *num* of year with fractional part. 

-**filterDatesByMonthGap** (*dates* = [], *min* = 1e1, *max* = 1e2, *round* = 0) - filter days of year's month inside borders and returns list of dates.    

### * Time *

-**time** (*value* = null, *key* = 'convert', *isTwelve* = false) - received *value* in minutes and convert it to HH:MM format, or if *key* equal 'deconvert' it returned number of minutes. Flag *isTwelve* is for US time format.   

-**times** (*start* = '00:00', *period* = 30, *num* = 10) - returned array of timestamps in HH:MM format beginning from *start* time with *period* in minutes, *num* - size of array. 

-**distinction** (*time* = '', *utc* = 0, *isNum* = true) - counts difference time between utc event and now; returns object with distinction in format (*number of minutes* or *text*) and flag {result, isGone}.  

-**event** (*time* = '12:00', *duration* = 90, *utc* = 1) - returns number of events that can be completed before utc time (by default CET).

-**clock** (*value* = 10, *arrow* = 'hour', *isPositive* = true) - returns degrees between 3 a.m. and hour/minute arrows by value in minute on clock.

-**formula** (*start* = '12:00', *duration* = 0, *body* = 'x + y - 1', *size* = 'minute') - substitution into formulas body *start* to x and *duration* to y, return result as time string.

-**sequence** (*start* = '12:00', *interval* = 10, *num* = 5, *mask* = ':30') - generates list of times with interval and checking each element on mask.

-**period** (*num* = 1e2) - receives number border and returns text of time period with random generated number. 

-**matrix** (*time* = '', *size* = 1, *step* = 0, *delay* = 30) - builds matrix of times with *step* and *delay* of each matrix row in minutes.  
 
-**percentage** (*time* = '', *round* = 0) - returns an array of rounded numbers, which are % of each time part from its maximum.  

-**timeRound** (*time* = '', *num* = 5) - rounds time's minutes by parameter *num* and returns result.      

-**timeByPercent** (*num* = 1e1, *round* = 0) - generated and rounds time by % of it's maximum.     

-**timeByFibonacci** (*num* = 7) - returns time generated by Fibonacci's number as minutes.

-**timeByNumeralSystem** (*num* = 1e1, *system* = 2) - returns time generated by convertation of *num* from *system* to decimal numeral system.

-**randomTimes** (*num* = 1, *min* = 0, *max* = minutesMax) - returns list of times by parameters. 

-**timeDistance** (*start* = '', *end* = '') - returns time between 2 borders. 

-**timeAllocation** (*start* = '07:00', *end* = '23:59', *num* = 1, *isIncludeEndBorder* = false) - generates list of time by borders with step of allocation.  

-**timeByNumbersOperations** (*base* = 1e3, *numbers* = []) - builds time by random math operations with base and numbers.        

-**timeByDeviation** (*base* = 6e2, *percent* = 1e1, *isTopBorder* = true) - creates time by random +- deviation inside *percent* of basic minutes value.   

-**timestampsByPercent** (*border* = 6e2, *list* = [], *isUniq* = false) - generates list of timestamps from now to *border* by *list* of %.    

-**timeMove** (*num* = 0, *isForward* = true) - moves time from current to custom by *num* of minutes and direction by *isForward*.  

-**timeByText** (*content* = '') - returns formatted time built with text like '15 hours 37 minutes'. 

-**timesByDigits** (*numbers* = []) - builts array of valid times using all digits from *numbers*.

-**timesSortedBy** (*arr* = [], *criterion* = 'all', *isIncreased* = true) - sorting list of times by *criterion*: hour, minute or all; returns sorted array. 

-**timeByFormula** (*formula* = '', *value* = 1, *base* = 0, *marker* = 'x') - generates time by formula with minutes *base*.          

-**timestampsByProgression** (*operations* = [], *length* = 1, *base* = 6e2) - builds list of times with operations and minutes *base*.   

-**timeByMultiplication** (*base* = 6e2, *percent* = 1, *iterations* = 1) - generates time by multiplication *percent* (10% => 1.1) and *base* while *iterations*.   

-**timeByParameters** (*hours* = [], *minutes* = []) - returns time built by parameters's maximum borders with randomly generated value inside borders.

-**timestampsByRandomlyStep** (*base* = 6e2, *step* = 1e2, *num* = 5) - returns list of times with randomly minutes step inside borders: 0 to *step* / *num*.

-**timeByDayPart** (*part* = '', *base* = 0, *isSubtraction* = false) - returns time of day's part with minutes *base*. 

-**ms** (*value* = null, *key* = 'convert') - convert / deconvert time in ms.   

-**timeResidue** (*time* = '') - returns number of minutes to rich next hour.      

-**timePartMultiplicity** (*time* = '', *index* = 1, *num* = 5) - returns true / false by checking time part's multiplicity to *num*.       

-**timestampsByRounding** (*time* = '', *step* = 1, *isForward* = true, *isIncludeBorder* = true) - builds list of times from *time* to rounded hour time by *isForward* with *step*.   

-**timestampsByBorders** (*min* = 6e2, *max* = 1e3, *steps* = [], *round* = 0) - returns list of times by minutes *steps* (% of difference between *max* and *min*).    

-**timestampsByTimeParts** (*hours* = [], *minutes* = []) - returns list of times by parameters in order.   

-**timeHourReflection** (*time* = '') - returns number of hours before day end. 

-**getTimeParity** (*time* = '') - returns maximum number multiple of time minutes. 

-**checkTimeByBorders** (*time* = '', *min* = 6e2, *max* = 1e3, *isLowerBorderInclude* = true, *isHighBorderInclude* = true) - returns true/false after validation time by munutes borders. 

-**percentOfTimeMaximum** (*times* = [], *percent* = 1e1, *round* = 0) - returns minutes by % of largest time.  

-**findTimeWithSmallestMinutePart** (*times* = []) - finds time with smallest minute part among *times* and returns it.  

-**timeByMultiplicity** (*num* = 1e1, *min* = 6e1) - generates time whose multiple is *num* and it more than *min*. 

-**findNearestTimeRoundMinutes** (*time* = '', *minutes* = [], *isIncrease* = true) - finds nearest minutes part to round up *time* and returns it. 

-**filterTimesByInterval** (*timestamps* = [], *start* = 1e1, *num* = 1, *isMinutes* = false) - filters time's part inside interval by parameters.  

-**filterTimePartsByInterval** (*time* = '', *min* = 1, *max* = 1e1) - validate time if hour and minute parts are between *min* and *max* borders.    

-**timeByRatio** (*hours* = 1e1, *num* = 1) - generates time by sum of *hours* and minutes equal *hours* * *num* (ratio).   

-**filterTimesByParity** (*times* = [], *num* = 1e1, *borders* = [0, minutesMax]) - returns filtered list of times by checking multiplicity on *num* and if it inside *borders*.      

### * Weekday *

-**gap** (*weekday* = null, *key* = 'tag') - return difference between weekday and today in days, key parameter is a variant of day calling (tag or title).

-**weekdayByDate** (*date* = '') - finds weekday by *date* and returns it. 

-**monthWeekdays** (*weekday* = '') - returns num of remaining *weekday* days in current month. 

-**weekdayNumByYear** (*year* = 2e3, *weekday* = 'Monday') - returns num of days *weekday* in *year*.  

-**weekdaysDifferenceByTime** (*days* = [], *times* = []) - returns difference between *days* with *times* in minutes.    

### * Year *

-**part** (*num* = 0, *size* = 'day') - returns % of year (check for leap year) for any period.

-**year** (*difference* = 0, *isRome* = false) - returns an object {year, isLeap}, by *difference* parameter you can get more ancient year from Jesus's birthday or Rome's foundation.

-**months** (*length* = 12, *isTitle* = false) - allows to get an array of months (title or number) since year beginning, slices and returns it in descending order.

-**vacation** (*days* = 0) - returns evenly distributed list of vacation's days per year and period.        

-**endOfMonth** (*date* = '') - counts number of days to end date's month.  

-**yearResidue** (*percent* = 0) - returns date generated by % of current year's residue.

-**yearsByFormula** (*formula* = '', *length* = 1e1, *marker* = 'x') - creates year by formula with variables with random value from 0 to 9.    

-**yearsByInterval** (*num* = 1, *step* = 1, *border* = this.date.getFullYear(), *isIncrease* = true) - returns list of years with custom *length* built by cycle from *border* increasing/decreasing order by *step*.    

-**yearsByCentury** (*century* = 21, *decade* = 1) - returns array of 10 items (years) in *century* and *decade*.

-**yearRound** (*value* = 2e3, *num* = 1e1, *percent* = 5e1) - returns rounded year by *value* / *num*.    

-**exchangeYearDigit** (*items* = [], *indexes* = []) - exchanges places of digits by *indexes* in each year of *items* and returns result.

-**getYearDigit** (*year* = 2e3, *index* = 1) - returns digit of year number by *index* position.   

-**changeYearDigit** (*year* = 2e3, *index* = 1, *value* = 1) - updated with new *value* digit of year by *index* and returns year. 

-**yearMove** (*year* = 2e3, *num* = 1e1, *isForward* = true, *border* = 2e3) - updates year by moving it forward / back with *border* checking.    

-**yearBorderCheck** (*year* = 2e3, *min* = 1e3, *max* = 2e3, *isIncludeBorder* = true) - checks if *year* are inside *borders*.    

-**yearByProgression** (*start* = 2e3, *size* = 1e2, *steps* = [], *round* = 0) - builds list of years by maximum *size* and % of *steps* added to *start* year.    

-**yearsByCenturies** (*centuries* = [], *values* = []) - generates years with of *centuries* and *values* (residue of division year on century).   

-**yearDigitChanges** (*year* = 2e3) - returns list of changes (-, + or =) between neighboring pairs of *year* digits.

-**yearByParameters** (*century* = 2e1, *quarter* = 1, *isEven* = true, *border* = 0) - returns year generated by different parameters. 

-**yearBySchema** (*schema* = '', *marker* = 'x') - builds an year by mathematic *schema* with variable.        

-**yearByParity** (*num* = 1e1, *min* = 1e3, *max* = 2e3) - randomly generates year inside borders which divisible by *num*.    

-**findMiddleYear** (*values* = [], *isCeil* = true) - finds middle year of list (nearest) and returns it.  

-**findLastingYearEnd** (*year* = 2e3, *duration* = 5e1, *percent* = 1e1, *round* = 0) - returns year by inverse *percent* (100 - *percent*) of *duration* added to *year*. 

-**findLastingYearPercent** (*year* = 2e3, *min* = 2e3, *max* = 21e2, *round* = 0) - finds % of difference between *min* and *max* by *year*.    

-**sortYearsByDigit** (*arr* = [], *index* = 1) - sorting list of years by *digit* in increase order. (based on ***Insertion Sorting***)    

-**validateYearPart** (*year* = 2e3, *start* = 1, *end* = 1, *validationText* = '') - validates digits of year with *validationText*.   

-**findYearAverageGap** (*items* = []) - returns average difference between pairs of years. 

-**mostVariousYear** (*years* = []) - finds year with different digits among all and returns it.    

-**filterYearsByCenturies** (*list* = [], *borders* = [], *exception* = null) - filter list of years by century parameters and returns it.    

-**yearsDifferenceOrder** (*min* = 1e3, *max* = 2e3) - returns number as power of 10 nearest difference between years.  

-**yearsInsideBorders** (*min* = 1e3, *max* = 2e3, *step* = 1) - generates list of years inside borders with step.  

-**findNearestYearFromList** (*value* = 1e3, *list* = [], *isEven* = true) - finds nearest to *value* year among *list*.    

-**filterYearsByDeviation** (*list* = [], *year* = 1e3, *dispersion* = 5, *isEven* = null) - filters years by *dispersion* and *isEven* and returns result. 

### * Num *

-**convert** (*value* = null, *key* = 'convert') - convert Indian number to Roman and reverse, return string by default or number. 

-**border** (*num* = null, *isRome* = false) - receives century (number Indian or string Roman) and returns array of first and last year of century.    

-**century** (*year* = 1000, *isRome* = false) - return century in Roman/Indian format by year (number).

-**numToDottedString** (*year* = 2e3) - converts *number* into string with every 3 digits dot and returns it.      

-**numDigitInResidueExist** (*num* = 1e1, *position* = 1) - checks if digit *num* by *position* exist in it residue.    

-**digitsOfNum** (*num* = 1e1) - returns list of num's digits, each one is multiplied by powered 10.        

-**numResidueSum** (*num* = 1e1) - counts sum of all digits of num's fractional part.        

### * Filters and Validation *

-**filterByValue** (*date* = '22.02.2024', *period* = 'day', *value* = 22) - filter date by period with int value and return true/false.            

-**palindrom** (*value* = '', *isDate* = true) - check if date or time is palindrom and return true/false.

-**isWillBe** (*date* = '24.08.2024') - checking and returns true/false by proviso "Date is today or will be in the future".

-**func** (*time* = '12:30', *body* = '', *marker* = 'x') - validates time hours and compared it to minutes by formula.     

-**isWeekend** (*time* = '12:30', *body* = '', *marker* = 'x') - checks and returns if today is Saturday/Sunday. 

-**filterBySchema** (*content* = '', *isDate* = true, *schema* = '', *index* = 0) - check date or time period by running code in *schema*. 

-**similarity** (*content* = '', *isDate* = true, *mask* = '') - compare date/time with *mask* and returns % analogy by cheking each period.

-**isEven** (*content* = '', *isDate* = true) - checking parts of date/time and returns boolean flag items "Is it even ?" + GCD (greatest common divisor). 

-**isTime** (*content*) - validate *content* value on time format HH:MM.    

-**isNight** (*time* = '') - checks time and returns if it during night.

-**isUniq** (*content* = '', *isDate* = true) - checks if date/time has uniq digits.      

-**isDate** (*content* = '') - validates if content is real date - DD.MM.YYYY. 

### * Transformation and Generation *

-**binary** (*value* = '', *isDate* = true) - check if each parts of date or time is equal 2**power (binary) and return true/false.

-**exchange** (*num* = 10, *from* = 'minute', *to* = 'hour') - receives value in first period and exchange it for second. 

-**format** (*value* = '', *key* = 'default', *isDate* = true) - formatting and returns date and time  by *key*: 'letter' for date and 'us' for time.  

-**duration** (*distance* = 10, *speed* = 1, *size* = 'hour') - solves problem to count duration in any format when we have distance (in km) and speed (km/h). 

-**walking** (*value* = 10, *size* = 'minute', *speed* = '*') - received time period and returns number of steps to walking while it.

-**hash** (*value* = '', *isDate* = true, *multiplier* = 1) - simple hash-function with good avalance effect based on date/time string.

-**bit** (*content* = '', *isDate* = false) - returns converted time/date string parts to binary. 

-**pomodoro** (*time* = '', *num* = 1, *duration* = 25, *pause* = 5, *rest* = 15) - according settings gives array of timestamps of tasks beginning.

-**us** (*content* = '', *isDate* = true, *isRange* = false) - converts time or date into american format. 

-**num** (*digit* = 1) - randomly generates integer 0 <= x <= 8991, choosing multiplier inside method's formula by parameter *digit*. 

-**reading** (*text* = '', *isNum* = true) - returns minutes of text's reading duration in different formats.       

-**cat** (*date* = '', *max* = 100) - converts duration of cat's life (starts by parameter *date*) into human age according life expectancy by parameter *max*.    

-**zodiac** (*date* = '') - looking for zodiac sign by your birthdate and returns it. 

-**replace** (*content* = '', *isDate* = true) - swaps time/date parts and returns result.      

-**late** (*time* = '12:30', *deadline* = '12:30', *duration* = 0) - counts % of time waste when you late.  

-**circle** (*radius* = 1, *speed* = 1, *isMeters* = false) - returns time of moving on circle.     

-**generation** (*min* = 2e1, *max* = 3e1, *num* = 5) - counts year when was born the man of *num* generations from the past.  

-**space** (*num* = 1, *size* = 'day', *title* = 'Earth') - converts planet's period (by *num* and *size*) into Earth's days.   

-**encode** (*content* = '', *isDate* = true, *formula* = '(x + 1) / 2', *marker* = 'x') - returns encoded string of date/time by *formula*, contains with letters, numbers and specific symbols.   

-**rate** (*time* = '12:30', *cost* = 1, *round* = 1) - gives information about money which you can earn from now until *time* by hour *rate*. 

-**capital** (*num* = 1, *period* = 'day', *rate* = 1) - returns earned money for any period by hour rate.        

-**deviation** (*step* = 600, *round* = 0) - counts absolute difference in % between now and *step*.   

 -**interval** (*time* = 1, *code* = '', *callStack* = 1e3) - runs your code in interval by time limit.     

-**timeout** (*delay* = 0, *code* = '') - runs your code after delay (in seconds).  

-**timestamp** (*date* = '', *time* = '') - returns approximate number of ms from 01.01.1970 to *date* and *time*.  

-**activity** (*timestamps* = [], *percent* = '') - returns minutes to complete all timestamps by *percent*.     

-**age** (*birthdate* = '') - counts y.o. of person by date and returns it.    

-**generator** (*numbers* = [], *isDate* = true) - builds date or time by periods by ratio between each element of *numbers* and sum of them.

-**capacity** (*date* = '') - returns number as a result of division years of date by period since beginning of year.      

-**change** (*content* = '', *period* = 'month', *num* = 12, *isDate* = true) - rewrites any period of date or time.  

-**id** (*content* = '', *isDate* = true) - generates id from time or date and returns it.    

-**fromArray** (*arr* = []) - returns list of dates built from array's elements.    

-**summer** (*date* = '', *round* = 0) - returns % of summer period by date.           

-**cigarette** (*time* = '', *num* = 1e1, *round* = 0) - returns how much time you waste of smoking a cigarette. 

-**quarter** (*time* = '') - receives time and returns an object with quarter information {quarterNumber, nearestQuarterSize, percent}.  

-**schedule** (*days* = [], *times* = [], *num* = 1) - builds an array of strings "time date" by parameters.

-**track** (*timestamps* = [], *speed* = 7e1, *round* = 0) - counts total duratiopn & distance of track's trip and returns {time, distance}. 

-**wheel** (*size* = 29, *time* = '00:15', *speed* = 2e1) - finds distance what you passed on bike with wheel's diameter *size* in inch for *time* with speed (km/h). 

-**bySchema** (*schema* = '', *isDate* = true, *marker* = 'x') - generates date or time by text *schema* with random value instead of *marker*.      

-**match** (*first* = '', *second* = '', *controllers* = [], *isDate* = true) - match every part of date / time with *controllers* (symbols of comparing) and returns result.           

-**curryTime** (*hours* = 1) - generates time by current and returned functions (currying).    

-**update** (*content* = '', *schema* = '', *indexes* = [], *operation* = '', *isDate* = true) - updates every parts of time / date by checking it with *schema* and change by *operation*. 

-**exchangePeriod** (*items* = [], *indexes* = [], *isDate* = true) - exchanges periods of date or time by *indexes* and returns result.

-**weekdaysDifferenceByWeek** (*start* = '', *end* = '', weeks = 0) - returns days of difference between 2 weekdays.            

-**everydaySpending** (*base* = 1e1, *age* = 8e1, *round* = 0) - counts years of time spending by *base* in minutes everyday waste. 

-**fee** (*cost* = 2e2, *percent* = 15, *duration* = 1e1, *delay* = 0, *round* = 0) - counts $ to pay for service with *delay* in minutes.    

-**partition** (*timestamps* = [], *efficiency* = 1e2, *round* = 1) - returns list of times by partition elements in pairs with % of *efficiency*.

-**week** (*days* = [], *hours* = 4e1, *overtime* = 0) - distributes equally working hours in week.   

-**frames** (*start* = 2e3, *end* = 21e2, *step* = 1, *size* = 1, *isYear* = true) - builds time or year frames by parameters.  

-**life** (*century* = 2e1, *percent* = 1e1, *size* = 8e1) - returns years of life with % of *size* in *century*.   

-**lifePart** (*periods* = [], *century* = 21, *round* = 0) - returns % of lifetime in *century*.        

### * Find *

-**nearest** (*time* = '', *arr* = [], *key* = '') - finds among timestamps the most close to given time (after it) and returns it. 

### * API and Information *

-**utc** - returns Promise with european towns's timezones.     

-**info** (*text* = '', *isDate* = true) - returns an object with actual information about time/date.