## About       

JavaScript library to handling, parsing, validation and formatting date or time.      

* Light, great and powerful analogue of **Moment.js** :star:                       
* Current Version: **2.1.2** 
* Most of algorithms have **O(n)** time complexity
* **5.5K** lines of code and **340 methods** :gem:       

## Links

Download - *https://www.npmjs.com/package/datus.js*     

Try - *https://portal-datus.vercel.app*     

## Getting Started 

```js

import {Datus, weekdaysTitles, weekdaysTags, dayParts, months, minutesMin, minutesMax, periods, seasons, timeMeasures} from 'datus.js'  

```

- - -

**Datus** - main class of library.         

**weekdaysTitles** and **weekdaysTags** - list of weekdays by it's name and tag ("Monday" => "Mon").  

**dayParts** - time parts of day.   

**minutesMax** - max border of time in minutes.   

**periods** - list of time's periods (from second to year).   

**timeMeasures** - list of time's measures in day (from ms to h with size in seconds).    


## Examples

Just date changing from nowadays by step :date:

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

Filtering list of orders by time (more or less)  :clock2:  

~~~
    const border = 1140 // 19:00            
    const deadline = '01.01.1970' // IPhone's nightmare     
    const distanceSize = 7 // one week    
    
    let orders = [{title: '', time: 'HH:MM', date: 'DD.MM.YYYY'} and 1e3 of items]      
    
    orders = orders.filter(el => datus.time(el.time, 'deconvert') <= border)        
    
    let nearestOrders = orders.filter(el => datus.dateDistance(el.date, deadline) <= distanceSize)    
~~~

Validation times :watch:

~~~
    let time_start = '12:30'        
    let time_end = '18 15'        
    
    // let's check these times
    
    console.log(datus.isTime(time_start)) // true      
    console.log(datus.isTime(time_end)) // false    
~~~

Getting Rome's digits used in World of Tanks :video_game:

~~~
    const WOT_TIERS_LIMIT = 1e1

    new Array(WOT_TIERS_LIMIT).fill(0).map((_, idx) => datus.convert(idx + 1)) // ['I', 'II', 'III', 'IV',  'V', 'VI', 'VII', 'VIII', 'IX', 'X']
~~~

Can get list of days from date :calendar:

~~~
    let dates = ['07.05.2021', '02.12.2017', '01.09.2023', '14.03.1906']    

    let days = dates.map(el => datus.dateValue(el)) /// list of days            
~~~
    
## Methods     

There are more than 300 methods to work with 4 themes of library: *date, time, weekday and year*.   

### * Date and Day *

-**move** (*flag* = 'day', *direction* = '+', *num* = 0) - run through the calendar in all directions, return date.   

-**dates** (*flag* = 'week', *num* = 2, *weekday* = null) - create an array of dates since weekday (today by default) with time period iterations by *flag* ('day', 'week' or 'month'). *num* is a number of dates.  

-**difference** (*date*, *flag* = 'day', *lock* = 10) - find difference in *flag* time period (by default days) between today and date in past or future. *lock* is a integer limit of inside date iterations to compare with *date*. 

-**day** (*key* = 'start', *size* = 'hour') - returned number of hours/minutes/seconds after day starts (*key* = 'start') or until its end (*key* = 'end').

-**range** (*dates* = [], *period* = 'day') - returned difference between smallest and largest integer value of date's period ('day', 'month' or 'year') in array of unsorted dates.

-**now** (*format* = 'all', *divider* = '') - returns current date or time and divides it by second parameter.

-**pointer** (*text* = 'today') - formatting and returns date with word-pointer. 

-**dateDistance** (*start* = '', *end* = '', *size* = 'day') - counts difference between 2 dates in *size* and returns it.

-**deadlineOfMonth** (*date* = '02.12.1805', *percent* = 5e1, *round* = 0) - returns deadline which counted by *percent* of date's month size.            

-**percentOfMonth** (*date* = '', *num* = 1, *period* = 'day', *round* = 0) - returns % of remaining days of date's month by *period* and *num*.

-**monthDayBorder** (*date* = '', *num* = 1e1) - checks days by parameter *num* "if it less or equal to days before month end" and returns true/false.   

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

-**dateBySeason** (*year* = 1e3, *season* = 'Summer') - generates date with *year* in *season* randomly.    

-**getBirthdateByAgeRandomly** (*num* = 1) - returns randomly generated date by *num* age.    

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

-**timeByPercent** (*num* = 1e1, *max* = minutesMax, *round* = 0) - generated and rounds time by % of *max* in minutes.     

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

-**filterTimesByDifference** (*times* = [], *difference* = 1e1) - filters list of times by *difference* in munutes between current and next in each pair.   

-**timestampsByRadius** (*base* = 6e2, *border* = 1e2, *forward* = 1, *back* = forward) - generates list of times with radius (*border*) and nums of times (*back* and *forward*) more and less than *base*.        

-**timeTransform** (*time* = '', *num* = 1e1, *isIncrease* = true) - updates time with *num* minutes and returns result.    

-**averageTimeByIndexParity** (*list* = [], *num* = 1) - counts average times of indexes divided by *num* without residue.  

-**findLargestTimeDifference** (*list* = []) - finds largest difference between neighboring times and returns it in minutes.    

-**checkTimeByMultiplicityNumbers** (*time* = '', *nums* = []) - validates minutes of time by checking each element of *nums* by multiplicity for this value.   

-**filterTimesByMove** (*list* = [], *isIncrease* = true) - builds list of times if each one fits by *isIncrease* row flag. 

-**timeAmbit** (*time* = '', *num* = 1e1) - returns upper and lower limits of time's minutes range. 

-**timeMultiplicityResidue** (*time* = '', *num* = 6e1, *round* = 0) - counts minutes ot *time* as residue from division it's value on *num*.   

-**timeByPercentOfStep** (*time* = '', *step* = 1e1, *percent* = 1e1, *isForward* = true) - updates *time* by addition or subtraction % of minutes *step*.  

-**timeIntersection** (*time* = '', *min* = 1, *max* = 1) - added number of munutes to *time* as a result of addition *min* before that sum become multiplicity to *max*.   

-**timesInsideBorders** (*min* = 1e2, *max* = 1e3, *step* = 1e1) - generates list of times by *step* inside borders.    

-**timeByMinuteResiduePercent** (*time* = '', *percent* = 1e1, *size* = 6e1, *isAfter* = true) - returns time by adding minutes part by parameters. 

-**timeBorders** (*time* = '', *percent* = 5e1, *size* = 1e2, *isForward* = true) - returns borders of times generated by parameters.   

-**nearestTimesByMultiplicity** (*time* = '', *num* = 5, *radius* = 1) - finds nearest *time* minutes value divided *num* without residue.  

-**timeByMinutePercent** (*time* = '', *num* = 1e2, *list* = [], *round* = 0) - added minutes to the *time* by *list* on *num* percents and returns updated times.  

-**filterTimeByMinuteBorders** (*time* = '', *num* = 1e1, *isInside* = true) - returns true / false if *time* minutes part is inside *num*. 

-**filterTimesByPartsDifferenceValue** (*list* = [], *min* = 0, *max* = 1e2, *round* = 0) - filters times by comparing difference between hours and minutes parts with % borders.   

-**filterTimesByPartsComparing** (*list* = [], *isMore* = true) - validates times by checking if hours part more than minutes (*isMore* = true).    

-**timeByRandomlyGap** (*time*= '', *num* = 1e1, *isIncrease* = true) - added or subtract randombly generated value [0 - *num*] to *time*.  

-**filterTimesByPartsMultiplicity** (*list* = [], *num* = 1) - returns only those times, which all parts (hours and minutes) divided on *num* without any residue.  

-**filterTimeWithGapByMultiplicity** (*time* = '', *gap* = 1e1, *num* = 1, *isForward* = true) - validates if *time* with nminute *gap* divided on *num* without residue.    

-**filterAdjecentTimesByPartActionMultiplicity** (*list* = [], *num* = 1, *isMinutes* = true, *isSum* = true) - returns only those adjecent times, which has sum / difference of minutes or hours divided on *num* without residue. 

-**filterTimesByAveragePart** (*list* = [], *num* = 1, *min* = 1, *max* = 1, *isMinutes* = true) - returns only those times, which has average part by *isMinutes* flag inside borders. 

-**filterTimesByPartsResidue** (*list* = [], *num* = 1, *residue* = 1, *isMinutes* = true) - validates only those times with part by *isMinutes* divided on *num* with *residue*.   

-**timeByPartsMultiplicity** (*nums* = []) - generates time by parts *nums* with multiplication values. 

-**findNearestTimeMultiplicityPart** (*time* = '', *num* = 1, *isMinutes* = true) - updates *time* by multiplicity check of each part by *num*. 

-**findAverageTimePart** (*list* = [], *isMinutes* = true) - returns average value of hours or minutes in *list*.   

-**filterTimesByNearestPart** (*list* = [], *num* = 1e1, *difference* = 0, *isMinutes* = true) - returns only those times, which has part by *isMinutes* different from *num* <= *difference*.  

-**filterTimesByDynamicDifference** (*list* = [], *min* = 0, *max* = 1e1, *round* = 0) - filters times by pairs, for each one difference between elements should be inside *min* and *max* as % of first value in pair.     

-**findAverageTimesGap** (*list* = [], *marker* = 1e3) - returns average difference between times and *marker* in minutes.  

-**filterTimesByMinutePartChangingByGap** (*list* = [], *num* = 1e1, *min* = 0, *max* = 1e2, *isAddition* = true) - updates minutes by *num* and *isAddition*, then filters by comparing previous and current minutes values inside % borders by *min* and *max*.   

-**timestampsByRadomlyDeviation** (*time* = '', *num* = 1, *radius* = 1e1, *isIncrease* = true) - generates list of times by *radius* and *isInrease* based on *time*.  

-**findTimeBorders** (*list* = []) - finds borders as range of time *list* and returns it [min, max] times. 

-**findPercentOfTime** (*time* = '', *round* = 0) - counts % of time from day duration in minutes and returns rounded value.    

-**checkTimePartsByOneDigitDifference** (*time* = '') - returns true if time's parts is not similar with only one digit.    

-**lexisTime** (*time* = '') - makes great text about *time*.   

-**filterTimesBySchema** (*list* = [], *schema* = '', *marker* = 'x') - returns only those times, which were built according to *schema*.   

-**findOppositeTime** (*time* = '') - turns over time's hours and minutes.  

-**transferTimeMinutePart** (*time* = '') - turns over minutes of *time* and rounding hours.    

-**sortTimesByMinuteQuarters** (*list* = []) - quickly sorts times by minutes quarters and returns list with 4 quarters times.  

-**isCleanTime** (*time* = '') - returns true/false depending on max time's part divided on min without residue.    

-**changeTimeByPercent** (*time* = '', *num* = 0, *isMinutes* = true, *isIncrease* = true, *round* = 0) - updates time's part in % by parameters.   

-**filterTimesByPartsDifferenceMultiplicity** (*list* = [], *num* = 1) - filters times checking parts difference by multiplicity.   

-**findNearestTimeByMultiplicity** (*time* = '', *num* = 1) - updates *time* by find nearest minutes value multiple to *num* and returns new time.  

-**findAllTimePairsBySumMultiplicity** (*list* = [], *num* = 1) - returns only those times which pair's sum of minutes divided on *num* without residue.    

-**smoothTimesByMultiplicity** (*list* = [], *num* = 1) - changes times by reducing minute difference between adjacent elements.    

-**findAllTimestampsByMultiplicity** (*num* = 1, *min* = 1e2, *max* = 6e2) - builds list of times multiple *num* inside borders.    

-**timestampsByHoursAndRatio** (*list* = [], *ratio* = 1) - returns times by *list* of hours and minute *ratio* as multiplier of each hour element. 

-**findAverageTimesDeviationByCycle** (*time* = '', *list* = [], *cycle* = 3e1, *round* = 0) - returns % of average deviation of *list* elements from *time* by minutes *cycle*.    

-**timestampsByDayPartition** (*start* = 1e3, *num* = 0) - returns all day's times after *start* minutes value with *num* step. 

-**timestampsByRandomlyDeviationFlagList** (*time* = '', *forward* = 1e1, *back* = forward, *list* = [], *num* = 1) - generates times with randomly step by *list* of booleans and borders. 

-**timeByRandomlyMultiplicity** (*time* = '', *max* = 1e1, *num* = 1, *isForward* = true) - returns updated time randomly with *max* minutes border mutliple to *num*.  

-**timestampsByMinutePartInsideBorders** (*min* = 6e2, *max* = min, *part* = 1e1) - builds list of times with minutes *part* inside borders.    

-**getTimeDigit** (*time* = '', *isMinutes* = true, *isJunior* = true) - returns any digit of time by parameters.   

-**updateTimePartByMultiplicity** (*time* = '', *isMinutes* = true, *num* = 1, *isFloor* = true) - transforms time's part by number multiple to *num*.  

-**timestampsByMultiplicity** (*time* = '', *num* = 1, *forward* = 1e2, *back* = forward) - builds list of times by minutes borders multiple to *num*.  

-**timeByBaseMultiplicityResidue** (*base* = 6e2, *num* = 1, *residue* = 0, *isFloor* = true) - generates time by minutes *base* mutiple to *num* + residue.    

-**timeByUSFormat** (*hours* = 1e1, *minutes* = 1e1, *isAfterMidday* = true) - converts american time format to european and returns time.  

-**timestampsByMultiplicityPartsInsideBorders** (*min* = 1e3, *max* = minutesMax, *length* = 1, *list* = [], *isFloor* = true) - returns list of times inside borders with *list* of multiple numbers.  

-**timestampsByHoursWithMinutesBordersMultiplicity** (*time* = '', *hours* = 1e1, *num* = 1, *min* = 1, *max* = 6e1) - returns times with minutes part mutliple to *num* inside borders.    

-**timestampsByRangeMultiplicity** (*time* = '', *range* = 1e2, *percent* = 1e1, *isForward* = true, *left* = 1, *right* = 1) - returns times built by minutes *range* from *time*. 

-**timestampsByDayPercentFragments** (*list* = []) - returns list of times by % of day duration.    

-**findTimeDistancePercentRegardingSize** (*time* = '', *border* = 1e3, *size* = 1e2, *round* = 0) - counts % of size as difference between *time* and *border*.    

-**timeUpdateByDayPercent** (*time* = '', *percent* = 1, *isForward* = true, *multiple* = 1) - updates *time* with % of minutes in day by parameters.      

-**timestampsByDayPercentRatio** (*time* = '', *percent* = 1e1, *ratio* = 1, *iterations* = 1) - generates list of times by % of day's minutes and *ratio* of each iteration.   

-**isSameTimeQuarter** (*time* = '') - validates *time* if hours and minutes parts have same quarter.      

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

-**filterYearsByRadius** (*list* = [], *radius* = 1e1, *middle* = 5e1) - filters years checking each inside borders by *radius* from *middle*.  

-**filterYearBySchema** (*value* = 1e3, *schema* = '', *marker* = '*') - filters year by text *schema* with *marker* as random digit and returns true / false.  

-**filterYearsByDifference** (*list* = [], *min* = 0, *max* = 1e1) - checks neighboring years difference by *min* and *max* borders.    

-**filterYearsByMultiplicity** (*list* = [], *num* = 1) - returns list of years divided by *num* without residue.   

-**findYearsAverageCenturyGap** (*list* = []) - returns average years to pass over the century. 

-**filterYearsByParityOfDifference** (*list* = [], *num* = 1) - filters years pairs by *num* multiplicity of difference.    

-**filterYearsByResidueFill** (*list* = []) - returns years by pairs after checking if century residue of first item can be filled by residue of next.  

-**findYearsParitySubsequences** (*list* = [], *seq* = []) - filters years by sequence of multiplicity and returns result.  

-**yearsBorders** (*list* = []) - returns [min, max] borders of years list. 

-**yearsCenturies** (*list* = []) - finds all centuries of year list and returns sorted array.  

-**filterYearsByVariation** (*list* = [], *year* = 1e3, *less* = 0, *more* = 0) - filters years by checking each one inside borders.    

-**yearsByCustomSizes** (*year* = 1e3, *sizes* = [], *iterations* = 1) - generates list of years with custom steps by parameters.   

-**yearsAllocation** (*borders* = [], *step* = 1) - generates list of years inside *borders* with *step*.   

-**yearAmbit** (*year* = 1e3, *num* = 1e1, *isCheckCentury* = false) - builds borders of *year* with *num* radius. 

-**yearsMutateByIndex** (*list* = [], *index* = 1, *num* = 0, *isIncrease* = true) - changes each element of year *list* by it's index checking.    

-**yearsFromCentre** (*year* = 1e3, *step* = 1, *radius* = 1) - generates list of years from *year* centre by *radius* and *step*.  

-**yearByPercentInsideBorders** (*min* = 1e3, *max* = 2e3, *percent* = 5) - founds year located inbside borders by % and returns it.    

-**findNearestYearByMultiplicity** (*year* = 1e3, *num* = 1, *isMore* = true) - returns nearest year to *year* divided on *num* without residue.    

-**isYear** (*value* = null) - validates a *value* and returns true / false.    

-**sizeOfEra** (*year* = 1e1, *round* = 0) - returns % of year size in relation to our era since the birth of Christ.   

-**yearsByExceptTemplateDigit** (*year* = 1e3, *num* = 1) - generates list of years, each one has digit by *num* position not equal to *year* digit.    

-**yearsByPairs** (*start* = 1e3, *num* = 5, *step* = 1, *difference* = 1) - builds list of years in pairs by parameters.   

-**filterYearsByEqualAdjacentDigits** (*list* = [], *position* = 1) - returns validates list of years, each one has equal adjacent digit by *position*. 

-**findNearestYearByPercent** (*list* = [], *percent* = 1e1) - finds year among all list which is nearest to *percent* if max equals 100%.  

-**percentByYearInsideBorders** (*min* = 1e3, *max* = 2e3, *year* = 1e3) - returns as % position of *year* inside given borders.    

-**findDispersionOfCentury** (*list* = [], *century* = 2e1) - finds difference between min and max year of *century* among elements of the list.    

-**findMaximumOfCentury** (*list* = [], *century* = 2e1, *isEven* = null) - returns max year of century in *list*.  

-**yearsByCenturiesRandomlyRow** (*centuries* = [], *borders* = [], *iterations* = 1) - generates list of randomly years by parameters. 

-**yearsByCenturyBorders** (*borders* = [], *num* = 1e1, *step* = 5) - builds list of years between centuries with *num* residue and *step*.    

-**filterYearsByDifferenceSubsequence** (*list* = [], *seq* = []) - returns filtered years, each pairs of them has difference in *seq* position.    

-**filterYearsByDifferenceInverval** (*list* = [], *min* = 0, *max* = 1e1) - validates *list* of years between each pairs with difference less *max* and more than *min*.   

-**yearsByCenturiesMultiplicity** (*centuries* = [], *min* = 0, *max* = 1e2, *num* = 1) - generates by *centuries* and residue borders (*min* and *max*) by *num* step. 

-**filterYearsByResidueExclude** (*list* = [], *num* = 1e1) - returns years which have other residue ( / 100) than *num*.   

-**filterYearsByResidueInterval** (*list* = [], *min* = 0, *max* = 1e2, *isEven* = null) - filters and returns years which residue (/ 100) is inside the borders and *isEven* flag. 

-**filterYearsByCenturyExclude** (*list* = [], *century* = 0) - returns only those years in *list*, which has other century.    

-**filterYearsByCenturyRadius** (*list* = [], *century* = 2e1, *num* = 1e1) - validates items of *list* if each one inside radius built as *century* +- *num*.  

-**yearsByRow** (*year* = 1e3, *steps* = [], *jump* = 1e1, *iterations* = 1) - generates list of years by parameters where *jump* at the end of each *iteration*.   

-**yearsByFractions** (*start* = 1e3, *end* = 2e3, *list* = []) - returns array generated as [] of *start* + (el / *list* max * difference between *start* and *end* - fraction).   

-**yearsByJumping** (*year* = 1e3, *steps* = [], *jumps* = []) - builds list of years by *steps* of every interation and *jump* after that. 

-**yearByRandomlyGap** (*year* = 1e3, *num* = 1e1, *isIncrease* = true, *isEven* = null) - generates year base on *year* with *num* randomly gap.   

-**filterYearsByDifferenceResidueInterval** (*list* = [], *min* = 1e1, *max* = 5e1) - filters if difference between years residue (el % 100) in each pair more than *min* and less than *max*.  

-**yearsByRandomlyDeviation** (*year* = 1e3, *num* = 1, *max* = 1e1, *isIncrease* = true) - returns list of years generated as array based on *year* with randomly deviation of *num*.  

-**filterAdjacentYearsBySameCentury** (*list* = [], *isSpread* = true) - returns list of years which pair is same century.  

-**yearDispersionByRadius** (*year* = 1e3, *num* = 1) - randomly generates borders of years by *num* radius.    

-**yearBordersByPercent** (*year* = 1e3, *size* = 1e2, *borders* = []) - returns borders built by % of *size* in *borders*. 

-**filterYearsByMultiplicitySubsequence** (*list* = [], *numbers* = []) - validates years by sequence of multiplicity numbers *numbers*.    

-**findYearsByMultiplicityOnDistance** (*year* = 1e3, *border* = 1e1, *num* = 1) - builds list of year by *border* distance with step *num*.    

-**yearsByMultipleStep** (*year* = 1e3, *max* = 1e1, *num* = 1, *step* = 1) - returns *num* length list with randomly elements *year* + *max*.  

-**filterYearByDigitsDifference** (*year* = 1e3, *digits* = [], *min* = 1, *max* = 1e1) - validates year by sum of differences adjacent digits and returns true or false.   

-**filterYearsByResidueDeviation** (*list* = [], *num* = 5e1, *size* = 1e1) - filters years by checking residue (/ 100) inside borders by *num* with deviation *size*.  

-**findAverageYearsDeviation** (*list* = [], *num* = 1) - returns average difference of residue (/ 100) between *num* and elements of *list*.   

-**changeYearsByNearestResidueMultiplicity** (*list* = [], *num* = 1) - updates list of years by finding nearest residue (/ 100) of *num* multiplicity value.   

-**yearsByRandomlySchemaDeviation** (*year* = 1e3, *schema* = [], *forward* = 1e1, *back* = forward) - builds list of years by true (forward) / false (back) moving *schema*.   

-**filterYearsByCenturyDifference** (*list* = []) - filters years by pairs (first and second, second and third), in which elements have diffirence al least 1 century.  

-**sortYearsByResidue** (*list* = [], *isIncrease* = true) - takes only those years, which are increase/decrease in order by *isIncrease*.  

-**filterYearsByResidueMultiplicityOnCentury** (*list* = []) - returns years, which century is multiplicity for residue (/ 100).    

-**yearsByMultiplicityInterval** (*min* = 1e3, *max* = 2e3, *num* = 1) - generates years from *min* to *min* by *num* as step and multiplicity number.  

-**filterYearsByQuarterSchema** (*list* = [], *schema* = []) - filters and returns only those year, which residue (/ 100) inside *schema* of quarters.  

-**convertYearResidueIntoGap** (*year* = 1e3) - returns base of year (1964 => 1900) + converted residue 64 => 36 as year.   

-**findYearsSubsequenceByAverageResidue** (*list* = [], *num* = 1e1, *fault* = 0, *round* = 0) - finds list of year which average residue (/ 100) is inside % of *num* by *fault*.  

-**findYearsSubsequenceByDeviationSchema** (*list* = [], *num* = 1e3, *schema* = []) - builts list of year according on comparing each element with *num* if it will be more => true, less -false by *schema*.   

-**yearsResidueBorders** (*list* = []) - generates year's [min, max] borders by residue (/ 100).    

-**transformYearsResidue** (*list* = [], *ratio* = 1) - updates year's residue by *ratio*.  

-**smoothYearListByResidue** (*list* = [], *num* = 5e1) - changes list of year by smooth element's resodue (/ 100), which should be closer to *num*.    

-**getYearDistanceByCenturyResidue** (*year* = 1e3, *residue* = 5e1) - counts difference between *year* residue (/ 100) and *residue*.  

-**roundYearListByResidueToMultiplicityNum** (*list* = [], *border* = 1, *num* = 1) - updates year's residue if it more than *border* by rounding to *num*. 

-**roundYearByBorderMultiplicity** (*year* = 1e3, *border* = 1e1, *num* = 1) - updates year by *num* rounding it's residue (/ 100) subtracted *border*. 

-**findYearsDeviationSubsequenceByResidueList** (*list* = [], *nums* = []) - finds largest subsequence with each year's residue more than nums each element.    

-**allYearsBordersByParameters** (*length* = 1e1, *century* = 2e1, *num* = 1) - generates year borders in *century* with step *length*. 

-**filterYearsByResidueOutsideBorders** (*list* = [], *min* = 1, *max* = 1e1, *num* = 1) - returns only those years, which residue (/ 100) outside borders. 

-**getAllYearsBordersFromList** (*list* = [], *difference* = 1e1, *isMore* = true, *num* = 1) - finds pairs of years (borders) validated with *difference* by *isMore* and multiplicity *num*.  

-**transformYearsBordersByMultiplicity** (*borders* = [], *num* = 1, *isInside* = true) - transforms borders of years by *num* as multiple number.  

-**yearByMultiplicityRandomly** (*num* = 1, *min* = 1e3, *max* = 2e3) - returns randomly generated year with *num* mutliple inside borders. 

-**findYearsPairsByDifferenceMultiplicity** (*list* = [], *min* = 0, *max* = 1e1, *num* = 1) - finds only those year pairs, which has difference multimple *num* inside borders.    

-**filterYearsByRatio** (*list* = [], *ratio* = 1, *isMore* = true) - validates years by *ratio* of residue (/ 100) to centenary.   

-**getYearInsideBordersByPercentMultiplicity** (*min* = 1e3, *max* = min, *percent* = 1e1, *num* = 1, *isMore* = true) - returns year multiple to *num* by % inside borders.    

-**findAllYearsByCenturyAndResidueDifference** (*list* = [], *century* = 0, *min* = 0, *max* = min) - returns only those years, which have *century* and residue inside borders.    

-**findNearestYearByResidue** (*list* = [], *num* = 5e1) - finds year with smallest residue (/ 100) difference from *num*.  

-**yearsByMultiplicityList** (*from* = 1e3, *to* = 2e3, *list* = []) - generates years by *list* multiple numbers inside borders.   

-**findNearestYearsPair** (*list* = []) - finds nearest year values.    

-**yearsByMultiplicityParts** (*year* = 1e3, *border* = 1e2, *parts* = [], *num* = 1) - generates years by *parts* % and *border* multiple to *num*.    

-**groupYearsByResidueParts** (*list* = [], *num* = 1) - groups years by residue (/100).    

-**isYearResidueMultiplicity** (*year* = 1e3, *num* = 1) - returns true/false if *year* residue (/ 100) divides on *num*.   

-**yearsByPositionRowDistance** (*current* = 1e3, *next* = 2e3, *distance* = 1e2, *percent* = 1e1) - builds list with step from *current* to *next* in *position* on *distance*.    

-**yearsByMultiplicityRandomlyStep** (*from* = 1e3, *to* = 2e3, *num* = 1) - returns list with random steps.    

-**updateYearsResidueByMultiplicity** (*list* = [], *min* = 5e1, *max* = min, *num* = 1, *isFloor* = true) - transforms year's residue inside borders by multiple to *num*. 

-**yearsByRandomlyMultiplicityList** (*year* = 1e3, *size* = 1, *list* = [], *isIncrease* = true) - generates years based on *year* with *list* of multiple numbers and border *size*.  

-**getAllYearsWithWeekdayByMonthAndDay** (*weekday* = 'Monday', *day* = 1e1, *month* = 1, *min* = 1e3, *max* = 2e3) - returns all years validated by parameters.    

-**nearestYearMultiplicityByPercentInsideBorders** (*from* = 0, *to* = 0, *percent* = 1, *num* = 1, *isFloor* = true) - generates year inside borders by % multiple to *num*.   

-**yearsByResidueRadiusMultiplicity** (*year* = 1e3, *length* = 1, *num* = 1) - builds list of years mutliple to *num*, which elements inside *year* residue (/ 100) borders.   

-**yearsPairsByActions** (*year* = 1e3, *toAdd* = 1, *toDelete* = 1, *num* = 1) - generates pairs of years with action by parameters.   

-**findRandomYearsOnDistanceMultiplicity** (*year* = 1e3, *border* = 1e2, *num* = 1, *size* = 1, *isIncrease* = true) - returns list of years with size by *size* generated randomly.   

-**buildYearBordersMultiplicity** (*century* = 1e1, *size* = 1e2, *percent* = 5e1, *num* = 1) - builds borders multiple to *num* based on *century* and *size*, forward border created by % of *size*.  

-**filterYearsByChangingCentury** (*list* = [], *num* = 1, *isForward* = true) - validates years by changing century after update with *num*.   

-**yearsRandomlyMultiplicityBorders** (*year* = 1e3, *num* = 1, *isAdjacentCentury* = false) - builds borders of *year* multiple to *num*.  

-**findAllYearsMultiplicityInsideAgeBorders** (*from* = 1e1, *to* = 5e1, *year* = 2024, *num* = 1) - generates list of years inside age's borders and *year* multiple to *num*. 

-**getLifeYearsByPercent** (*year* = 1e3, *percent* = 1e1, *age* = 1e2, *isAfter* = true) - returns life's borders by % lived after/before *year*.  

-**transformYearByMutliplicityRounding** (*year* = 1e3, *num* = 1, *percent* = 5e1) - updates year by *num* rounding if residue more/less than % of *num*.     

### * Filters and Validation *

-**filterByValue** (*date* = '22.02.2024', *period* = 'day', *value* = 22) - filter date by period with int value and return true/false.            

-**palindrom** (*value* = '', *isDate* = true) - check if date or time is palindrom and return true/false.

-**isWillBe** (*date* = '24.08.2024') - checking and returns true/false by proviso "Date is today or will be in the future".

-**func** (*time* = '12:30', *body* = '', *marker* = 'x') - validates time hours and compared it to minutes by formula.     

-**isWeekend** (*time* = '12:30', *body* = '', *marker* = 'x') - checks and returns if today is Saturday/Sunday. 

-**filterPartBySchema** (*content* = '', *isDate* = true, *schema* = '', *index* = 0) - check date or time period by running code in *schema*. 

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

-**stream** (*times* = [], *durations* = []) - sets in order list of *times* with *durations*.  

-**getValueByProbability** (*initial* = null, *wrong* = null, *num* = 1e1, *isRight* = null) - returns value by *num* % chance.  


### * API and Information *

-**utc** - returns Promise with european towns's timezones.     

-**info** (*text* = '', *isDate* = true) - returns an object with actual information about time/date.