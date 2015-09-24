var fakeweather;
var fakingEndpoint = 'forecast'
var fakeProxy; 

module.exports = {
  init : function(instanceCounter) {    
	fakeweather = require('./fakeweatherBase.js').init(instanceCounter, [fakingEndpoint])	
	fakeProxy = fakeweather.getFakedata(); // Local ref to fake data storage in memory for manipulation
	// Local fake variables
	this.precipMm = 0;
	this.chanceOfRainPercent = 0;
  },
  before : function() {     
	fakeweather.before();
  },
  after : function() {    
	fakeweather.after();
  },
  setPrecipitationMm : function(precipInMillimeters) {
	this.precipMm = parseInt(precipInMillimeters)
	
	fakeProxy.every(fakingEndpoint, 'shortIntervals', function(shortInt) {
		fakeProxy.updateObject(shortInt, 'precipitation.value', parseInt(precipInMillimeters));
	});
	fakeProxy.every(fakingEndpoint, 'longIntervals', function(longInt) {
		fakeProxy.updateObject(longInt, 'precipitation.value', parseInt(precipInMillimeters));
	});
  },
  setChanceOfRainPercentage : function(changeOfRainPercentage) {
	this.chanceOfRainPercent = parseInt(changeOfRainPercentage)
	
	fakeProxy.every(fakingEndpoint, 'longIntervals', function(longInt) {
		fakeProxy.updateObject(longInt, 'precipitation.probabilityOfPrecipitation', parseInt(changeOfRainPercentage));
	});
  },
  getPrecipitationMm : function() {
	return this.precipMm;
  },
  getChanceOfRainPercentage : function() {
	return this.chanceOfRainPercent+'%';
  }
};
