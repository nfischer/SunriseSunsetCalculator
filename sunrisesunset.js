#!/usr/bin/env node

// Compute the sunset and sunrise on a given date, using Javascript
// Based off the Python implementation at
// https://github.com/jebeaudet/SunriseSunsetCalculator

var CIVIL_ZENITH = 90.83333;
module.exports.CIVIL_ZENITH = CIVIL_ZENITH;

function SunriseSunset(date, latitude, longitude, localOffset, zenith) {
  if (date.hasOwnProperty('date') &&
      date.hasOwnProperty('longitude') &&
      date.hasOwnProperty('latitude')) {
    // Assume the user passed in an object containing fields
    zenith = date.zenith;
    localOffset = date.localOffset;
    longitude = date.longitude;
    latitude = date.latitude;
    date = date.date;
  }
  this.date = date;
  if (latitude < -90 || latitude > 90)
    throw new Error('Invalid latitude value');
  if (longitude < -180 || longitude > 180)
    throw new Error('Invalid longitude value');
  if (localOffset < -12 || localOffset > 14)
    throw new Error('Invalid localOffset value');
  this.latitude    = latitude;
  this.longitude   = longitude;
  this.localOffset = localOffset || 0;
  this.zenith      = zenith || CIVIL_ZENITH;
}

function _toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function _toDegrees(radians) {
  return radians * 180 / Math.PI;
}

SunriseSunset.prototype.calculate = function(date) {
  /* Computes the sunset and sunrise for the current day, in local time */
  if (!date)
    date = this.date;

  // Calculate the day of the year
  var N = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000*60*60*24));

  // Convert the longitude to hour value and calculate an approximate time
  var lngHour = this.longitude / 15;
  var t_rise = N + ((6 - lngHour) / 24);
  var t_set = N + ((18 - lngHour) / 24);

  // Calculate the Sun's mean anomaly
  var M_rise = (0.9856 * t_rise) - 3.289;
  var M_set = (0.9856 * t_set) - 3.289;

  // Calculate the Sun's true longitude, and adjust angle to be between 0
  // and 360
  var L_rise = (M_rise + (1.916 * Math.sin(_toRadians(M_rise))) +
      (0.020 * Math.sin(_toRadians(2 * M_rise))) + 282.634) % 360;
  var L_set = (M_set + (1.916 * Math.sin(_toRadians(M_set))) +
      (0.020 * Math.sin(_toRadians(2 * M_set))) + 282.634) % 360;

  // Calculate the Sun's right ascension, and adjust angle to be between 0 and
  // 360
  var RA_rise = (_toDegrees(Math.atan(0.91764 * Math.tan(_toRadians(L_rise))))) % 360;
  var RA_set = (_toDegrees(Math.atan(0.91764 * Math.tan(_toRadians(L_set))))) % 360;

  // Right ascension value needs to be in the same quadrant as L
  var Lquadrant_rise  = (Math.floor(L_rise/90)) * 90;
  var RAquadrant_rise = (Math.floor(RA_rise/90)) * 90;
  RA_rise += Lquadrant_rise - RAquadrant_rise;

  var Lquadrant_set  = (Math.floor(L_set/90)) * 90;
  var RAquadrant_set = (Math.floor(RA_set/90)) * 90;
  RA_set += Lquadrant_set - RAquadrant_set;

  // Right ascension value needs to be converted into hours
  RA_rise /= 15;
  RA_set /= 15;

  // Calculate the Sun's declination
  var sinDec_rise = 0.39782 * Math.sin(_toRadians(L_rise));
  var cosDec_rise = Math.cos(Math.asin(sinDec_rise));

  var sinDec_set = 0.39782 * Math.sin(_toRadians(L_set));
  var cosDec_set = Math.cos(Math.asin(sinDec_set));

  // Calculate the Sun's local hour angle
  var cos_zenith = Math.cos(_toRadians(this.zenith));
  var radian_lat = _toRadians(this.latitude);
  var sin_latitude = Math.sin(radian_lat);
  var cos_latitude = Math.cos(radian_lat);
  var cosH_rise = (cos_zenith - (sinDec_rise * sin_latitude)) / (cosDec_rise * cos_latitude);
  var cosH_set = (cos_zenith - (sinDec_set * sin_latitude)) / (cosDec_set * cos_latitude);

  // Finish calculating H and convert into hours
  var H_rise = (360 - _toDegrees(Math.acos(cosH_rise))) / 15;
  var H_set = _toDegrees(Math.acos(cosH_set)) / 15;

  // Calculate local mean time of rising/setting
  var T_rise = H_rise + RA_rise - (0.06571 * t_rise) - 6.622;
  var T_set = H_set + RA_set - (0.06571 * t_set) - 6.622;

  // Adjust back to UTC, and keep the time between 0 and 24
  var UT_rise = (T_rise - lngHour) % 24;
  var UT_set = (T_set - lngHour) % 24;

  // Convert UT value to local time zone of latitude/longitude
  var localT_rise = (UT_rise + this.localOffset) % 24;
  var localT_set = (UT_set + this.localOffset) % 24;

  // Conversion
  var h_rise = Math.floor(localT_rise);
  var m_rise = Math.floor(localT_rise % 1 * 60);
  var h_set = Math.floor(localT_set);
  var m_set = Math.floor(localT_set % 1 * 60);

  // Create datetime objects with same date, but with hour and minute
  // specified
  var ret = {};
  ret.riseTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
      h_rise, m_rise, 0);
  ret.setTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
      h_set, m_set, 0);
  return ret;
}
module.exports.SunriseSunset = SunriseSunset;
