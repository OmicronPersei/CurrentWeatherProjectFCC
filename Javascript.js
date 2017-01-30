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
             
//var printCurrentWeather = function() {
//  "use strict";
//  
//  currentWeatherAPI(37, -117, function (data) {
//    console.log(data);
//  });
//};

var getCurrentLocation = function(positionCallback) {
  "use strict";
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback);
  }
  
};

//var printCurrentLocation = function() {
//  "use strict";
//  
//  getCurrentLocation(function(position) {
//    console.log(position.coords.latitude);
//  });
//  
//};

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

//var printWeatherInfoCurLocation = function() {
//  "use strict";
//  
//  getWeatherAtCurrentLocation(function (openWeatherMapInfo) {
//    console.log(getWeatherInfo(openWeatherMapInfo));
//  });
//};

var weatherBackgroundDictionary = {
  "thunderstorm": "http://wtop.com/wp-content/uploads/2014/07/355929-1865x1254.jpg",
  "drizzle": "http://www.trbimg.com/img-579cb259/turbine/cgnews-heavy-rain-today-and-sunday-20160730",
  "rain": "http://www.smart-homes.co.uk/wp-content/uploads/2015/11/rain_drops_splashes_heavy_rain_dullness_bad_weather_60638_2560x1024.jpg",
  "snow": "http://vignette4.wikia.nocookie.net/phobia/images/a/aa/Snow.jpg/revision/latest?cb=20161109045734",
  "clear": "http://openwalls.com/image/14916/clear_day_of_summer_2560x960.jpg"
};

var getWeatherBackgroundKey = function(weatherInfo) {
  "use strict";
  
  if ((weatherInfo.ConditionsID >= 200) && (weatherInfo.ConditionsID < 300)) {
    return "thunderstorm";
  } else if ((weatherInfo.ConditionsID >= 300) && (weatherInfo.ConditionsID < 400)) {
    return "drizzle";
  } else if ((weatherInfo.ConditionsID >= 500) && (weatherInfo.ConditionsID < 600)) {
    return "rain";
  } else if ((weatherInfo.ConditionsID >= 600) && (weatherInfo.ConditionsID < 700)) {
    return "snow";
  } else if (weatherInfo.ConditionsID === 800) {
    return "clear";
  } else {
    return null;
  }
};

var getTextColor = function(weatherBackgroundType) {
  "use strict";
  
  switch (weatherBackgroundType)
    {
    case "thunderstorm":
        return "white";
        
      case "drizzle":
        return "white";
        
      case "rain":
        return "white";
        
      case "snow":
        return "black";
        
      case "clear":
        return "black";
        
      default:
        return "black";
    }
};

var TemperatureUnit = {
  FAHRENHEIT: "F",
  CELSIUS: "C"
};

var getTemp = function(tempUnit, temp) {
  "use strict";
  
  switch (tempUnit) {
    case TemperatureUnit.CELSIUS:
      return temp - 273.15;
      
    case TemperatureUnit.FAHRENHEIT:
      return ((temp - 273.15)*(9/5)) + 32;
      
    default:
      return null;
  }
};

var capitalizeFirstLetter = function(str) {
  "use strict";
  
  return str[0].toUpperCase() + str.substring(1);
};

var currentWeatherInfo = null;
var currentDisplaySettings = {
  "TempUnit": TemperatureUnit.CELSIUS
};

var displayWeather = function(currentWeatherObj) {
  "use strict";
  
  if (currentWeatherObj !== null) {
    var tempToDisplay = Math.round(getTemp(currentDisplaySettings.TempUnit, currentWeatherObj.Temperature));
    tempToDisplay += "°" + currentDisplaySettings.TempUnit;
    
    $("#temperature").html(tempToDisplay);
    $("#conditionsText").html(capitalizeFirstLetter(currentWeatherObj.ConditionsDescription));
    
    $("#location").html(currentWeatherObj.CityName);
  }
};

$(document).ready(function() {
  "use strict";
  
  getWeatherAtCurrentLocation(function(openWeatherMapObj) {
    currentWeatherInfo = getWeatherInfo(openWeatherMapObj);
    
    displayWeather(currentWeatherInfo);
  });
});