SunriseSunsetCalculator
=======================

This is a Javascript implementation of [this
algorithm](http://williams.best.vwh.net/sunrise_sunset_algorithm.htm). This npm
module is designed to be consistent with the [corresponding Python
module](https://github.com/jebeaudet/SunriseSunsetCalculator/). Any
inconsistencies should be reported in the bug tracker for either this project or
the Python project (I'm monitoring both).

Usage
-----

```Javascript
var ssc = require('sunrisesunsetcalculator');

var latitude = 46.805;
var longitude = -71.2316;
var zenith = ssc.CIVIL_ZENITH;
var localOffset = -5; // Eastern standard time

var rightNow = new Date();
var riseSetObj = new ssc.SunriseSunset(rightNow, latitude, longitude,
    /* optional */ localOffset, /* optional */ zenith);
var output = riseSetObj.calculate();

console.log('Using information for Quebec City');
console.log('Sunrise', output.riseTime);
console.log('Sunset', output.setTime);

// Or like this...

// You can shuffle the order of arguments by passing it in as an object
var input = {latitude: 34.0500, longitude: 118.2500, zenith: ssc.CIVIL_ZENITH, date: new Date()};
output = new ssc.SunriseSunset(input).calculate();

console.log('Using information for Los Angeles, CA');
console.log('Sunrise', output.riseTime);
console.log('Sunset', output.setTime);
```
