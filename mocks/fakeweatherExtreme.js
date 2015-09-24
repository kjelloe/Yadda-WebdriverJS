var fakeweather;
var endpoint = 'extreme'

module.exports = {
  init : function(instanceCounter) {    
	fakeweather = require('./fakeweatherBase.js').init(instanceCounter, [endpoint])
	this.getExtremeWeather();
  },
  before : function() {     
   fakeweather.before();
  },
  after : function() {    
	fakeweather.after();
  },
  getExtremeWeather : function() {	
	return fakeweather.getFakedata().getChildren(endpoint, 'times')
  }
};
