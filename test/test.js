var ssc = require('..');
var assert = require('assert');

var riseObj;

//
// Invalids
//

assert.throws(function () {
  riseObj = new ssc.SunriseSunset(new Date(), -91, 90);
}, /^Error: Invalid latitude value$/);

assert.throws(function () {
  riseObj = new ssc.SunriseSunset(new Date(), 91, 90);
}, /^Error: Invalid latitude value$/);

assert.throws(function () {
  riseObj = new ssc.SunriseSunset(new Date(), -90, 181);
}, /^Error: Invalid longitude value$/);

assert.throws(function () {
  riseObj = new ssc.SunriseSunset(new Date(), -90, -181);
}, /^Error: Invalid longitude value$/);

//
// Valids
//

// All the correct fields
var now = new Date();
riseObj = new ssc.SunriseSunset(now, -90, -180);
assert.ok(riseObj.hasOwnProperty('date'));
assert.ok(riseObj.hasOwnProperty('latitude'));
assert.ok(riseObj.hasOwnProperty('longitude'));
assert.ok(riseObj.hasOwnProperty('localOffset'));
assert.ok(riseObj.hasOwnProperty('zenith'));
assert.ok(typeof riseObj.calculate !== 'undefined');
assert.equal(riseObj.date, now);
assert.equal(riseObj.latitude, -90);
assert.equal(riseObj.longitude, -180);
assert.equal(riseObj.localOffset, 0);
assert.equal(riseObj.zenith, ssc.CIVIL_ZENITH);

riseObj = new ssc.SunriseSunset(now, -90, -180, -5);
assert.equal(riseObj.date, now);
assert.equal(riseObj.latitude, -90);
assert.equal(riseObj.longitude, -180);
assert.equal(riseObj.localOffset, -5);
assert.equal(riseObj.zenith, ssc.CIVIL_ZENITH);

riseObj = new ssc.SunriseSunset(now, -90, -180, -5, 89.2);
assert.equal(riseObj.date, now);
assert.equal(riseObj.latitude, -90);
assert.equal(riseObj.longitude, -180);
assert.equal(riseObj.localOffset, -5);
assert.equal(riseObj.zenith, 89.2);

// A date for which I know the correct sunrise/sunset values
var knownDate = new Date('Sun Feb 21 2016 18:43:51 GMT-0800 (PST)')
riseObj = new ssc.SunriseSunset(knownDate, 46.805, -71.2316, -5);
assert.equal(riseObj.date, knownDate);
assert.equal(riseObj.latitude, 46.805);
assert.equal(riseObj.longitude, -71.2316);
assert.equal(riseObj.localOffset, -5);
assert.equal(riseObj.zenith, ssc.CIVIL_ZENITH);

var result = riseObj.calculate();
// TODO(nate): fix timezone
assert.equal(result.riseTime.toString(), 'Sun Feb 21 2016 06:39:00 GMT-0800 (PST)');
assert.equal(result.setTime.toString(), 'Sun Feb 21 2016 17:18:00 GMT-0800 (PST)');

riseObj = new ssc.SunriseSunset(now, 46.805, -71.2316, -5);
assert.equal(riseObj.date, now);
assert.equal(riseObj.latitude, 46.805);
assert.equal(riseObj.longitude, -71.2316);
assert.equal(riseObj.localOffset, -5);
assert.equal(riseObj.zenith, ssc.CIVIL_ZENITH);

result = riseObj.calculate(knownDate);
// TODO(nate): fix timezone
assert.equal(result.riseTime.toString(), 'Sun Feb 21 2016 06:39:00 GMT-0800 (PST)');
assert.equal(result.setTime.toString(), 'Sun Feb 21 2016 17:18:00 GMT-0800 (PST)');

// Pass in arguments via object (can shuffle the order)
var riseObj2 = new ssc.SunriseSunset({date: now, longitude: -71.2316, latitude: 46.805, localOffset: -5});
assert.equal(riseObj.date, now);
assert.equal(riseObj.latitude, 46.805);
assert.equal(riseObj.longitude, -71.2316);
assert.equal(riseObj.localOffset, -5);
assert.equal(riseObj.zenith, ssc.CIVIL_ZENITH);

// Objects will be not equal, but will have equal attributes
assert.equal(JSON.stringify(riseObj), JSON.stringify(riseObj2));

// Pass in arguments via object (can exclude localOffset and include zenith)
riseObj = new ssc.SunriseSunset({date: now, longitude: -71.2316, zenith: ssc.CIVIL_ZENITH - 1, latitude: 46.805});
assert.equal(riseObj.date, now);
assert.equal(riseObj.latitude, 46.805);
assert.equal(riseObj.longitude, -71.2316);
assert.equal(riseObj.localOffset, 0);
assert.equal(riseObj.zenith, ssc.CIVIL_ZENITH - 1);
