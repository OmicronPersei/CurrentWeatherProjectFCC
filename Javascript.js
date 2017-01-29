/*global $, jQuery, ResponsiveBootstrapToolkit*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true  */

var currentWeatherAPI = function(lat, lon, callback) {
  "use strict";
  
  var openWeatherMapKey = "eba6361c94d44cc98fb3d9a18d0d6f92";
  
  var openWeatherMapRequest = "http://api.openweathermap.org/data/2.5/weather"; 
  openWeatherMapRequest += "?lat=" + lat;
  openWeatherMapRequest += "&lon=" + lon;
  openWeatherMapRequest += "&appid=" + openWeatherMapKey;
  
  jQuery.getJSON(openWeatherMapRequest, null, callback);
};
             
var printCurrentWeather = function() {
  "use strict";
  
  currentWeatherAPI(37, -117, function (data) {
    console.log(data);
  });
};