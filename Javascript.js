/*global $, jQuery, navigator*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true  */

var currentWeatherAPI = function(lat, lon, responseCallback) {
  "use strict";
  
  var openWeatherMapKey = "eba6361c94d44cc98fb3d9a18d0d6f92";
  
  var openWeatherMapRequest = "http://api.openweathermap.org/data/2.5/weather"; 
  openWeatherMapRequest += "?lat=" + lat;
  openWeatherMapRequest += "&lon=" + lon;
  openWeatherMapRequest += "&appid=" + openWeatherMapKey;
  
  jQuery.getJSON(openWeatherMapRequest, null, responseCallback);
};
             
var printCurrentWeather = function() {
  "use strict";
  
  currentWeatherAPI(37, -117, function (data) {
    console.log(data);
  });
};

var getCurrentLocation = function(positionCallback) {
  "use strict";
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback);
  }
  
};

var printCurrentLocation = function() {
  "use strict";
  
  getCurrentLocation(function(position) {
    console.log(position.coords.latitude);
  });
  
};

var getWeatherAtCurrentLocation = function(successCallback) {
  "use strict";
  
  getCurrentLocation(function(position) {
    
    currentWeatherAPI(position.coords.latitude, position.coords.longitude, function(weather) {
      successCallback(weather);
    });
  });
};

var getWeatherInfo = function(openWeatherMapInfo) {
  "use strict";
  
  var weatherInfo = {};
  
  weatherInfo.CityName = openWeatherMapInfo.name;
  
  //OpenWeatherMap weather condition ID.
  if (openWeatherMapInfo.weather.length > 0) {
    weatherInfo.ConditionsID = openWeatherMapInfo.weather[0].id;
    weatherInfo.ConditionsDescription = openWeatherMapInfo.weather[0].description;
  }
  
  //Temperature in Kelvin
  weatherInfo.Temperature = openWeatherMapInfo.main.temp;
  
  return weatherInfo;
};

var printWeatherInfoCurLocation = function() {
  "use strict";
  
  getWeatherAtCurrentLocation(function (openWeatherMapInfo) {
    console.log(getWeatherInfo(openWeatherMapInfo));
  });
};