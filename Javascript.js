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

var getCurrentLocation = function(positionCallback) {
  "use strict";
  //http://ipinfo.io/json
  
  jQuery.getJSON("http://ipinfo.io/json", null, function(response) {
    var positionPair = response.loc.split(",");
    
    var position = {
      "coords": {
        "latitude": positionPair[0],
        "longitude": positionPair[1]
      }
    };
    
    positionCallback(position);
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
  } else if (weatherInfo.ConditionsID > 800) {
    return "clouds";
  } else {
    return null;
  }
};

var textColorDict = {
  "thunderstorm": "white",
  "drizzle": "white",
  "rain": "white",
  "snow": "black",
  "clear": "black",
  "clouds": "black"
};

var getTextColor = function(weatherBackgroundType) {
  "use strict";
  
  var textColor = textColorDict[weatherBackgroundType];
  
  if (textColor !== undefined) {
      return textColor;
  } else {
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

var setActiveTempItem = function(displaySettings) {
  "use strict";
  
  $("#settingsDropDown>.temperatureItem").removeClass("active");
  
  switch (displaySettings.TempUnit) {
    case TemperatureUnit.CELSIUS:
      $("#settingsDropDown>.temperatureItem#celsius").addClass("active");
      break;
      
    case TemperatureUnit.FAHRENHEIT:
      $("#settingsDropDown>.temperatureItem#fahrenheit").addClass("active");
      break;
  }
};

var displayTemperature = function(currentWeatherObj, displaySettings) {
  "use strict";
  
  if (currentWeatherObj !== null) {
    
    var tempToDisplay = Math.round(getTemp(displaySettings.TempUnit, currentWeatherObj.Temperature), -1);
    tempToDisplay = Number(tempToDisplay).toFixed(1);
    tempToDisplay += "°" + currentDisplaySettings.TempUnit;
    
    $("#temperature").html(tempToDisplay);
    
    setActiveTempItem(displaySettings);
  }
};

var displayWeather = function(currentWeatherObj, displaySettings) {
  "use strict";
  
  if (currentWeatherObj !== null) {
    
    displayTemperature(currentWeatherObj, displaySettings);
    $("#conditionsText").html(capitalizeFirstLetter(currentWeatherObj.ConditionsDescription));
    
    $("#location").html("Current weather conditions in " + currentWeatherObj.CityName);
    
    var weatherBackgroundKey = getWeatherBackgroundKey(currentWeatherObj);
    var weatherBackgroundStyleClass = weatherBackgroundKey + "BackgroundStyle";
    $("body").removeClass();
    $("body").addClass(weatherBackgroundStyleClass);
    
    var mainBodyContentChildren = $(".mainBodyContent>.panel-body").children();
    
    var textStyleClass = getTextColor(weatherBackgroundKey) + "Text";
    mainBodyContentChildren.removeClass();
    mainBodyContentChildren.addClass("panel-body");
    mainBodyContentChildren.addClass(textStyleClass);
    
    $("#location").removeClass();
    $("#location").addClass(textStyleClass);
    
    
  }
};

var settingsClickHandler = function(e) {
  "use strict";
  
  var parent = e.target.parentElement;
  
  if (e.target && parent.matches(".settingsItem")) {
    if (parent.matches(".temperatureItem")) {
      
      if (parent.matches("#celsius")) {
        currentDisplaySettings.TempUnit = TemperatureUnit.CELSIUS;
      } else if (parent.matches("#fahrenheit")) {
        currentDisplaySettings.TempUnit = TemperatureUnit.FAHRENHEIT;
      }
      
      displayTemperature(currentWeatherInfo, currentDisplaySettings);
    }
    
  }
};

var setupSettingsEventHandler = function() {
  "use strict";
  
  document.getElementById("settingsDropDown").addEventListener("click", settingsClickHandler);
};

$(document).ready(function() {
  "use strict";
  
  setupSettingsEventHandler();
  
  getWeatherAtCurrentLocation(function(openWeatherMapObj) {
    currentWeatherInfo = getWeatherInfo(openWeatherMapObj);
    
    displayWeather(currentWeatherInfo, currentDisplaySettings);
  });
  
  
});