#!/usr/bin/env node

// A simple example of using the module

var ssc = require('..');

var latitude = 46.805;
var longitude = -71.2316;
var zenith = ssc.CIVIL_ZENITH;
var localOffset = -5; // Eastern standard time

var rightNow = new Date();
var riseSetObj = new ssc.SunriseSunset(rightNow, latitude, longitude,
    localOffset, zenith);
var output = riseSetObj.calculate();

console.log('Using information for Quebec City');
console.log('Sunrise', output.riseTime);
console.log('Sunset', output.setTime);
