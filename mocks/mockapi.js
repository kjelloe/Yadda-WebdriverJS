var MockAPI = require('../../../test/fixtures/MockAPI')
var fs = require('fs')
  , driver
  , api
  , server;

var mockServerPortBase = 3001;
var mockApiPortBase = 3002;
var mockServerPort;
var mockApiPort;
 
module.exports = {
	init : function(instanceCounter) {
		
		if(instanceCounter===undefined) { throw new Error("MockAPI cannot load if there is no instance number provided to assure unique port numbers"); }
		mockServerPort = mockServerPortBase + (2*instanceCounter);
		mockApiPort = mockApiPortBase + (2*instanceCounter);
		console.log('Server Port: ' + mockServerPort);
		console.log('API Port: ' + mockApiPort);		

		api = MockAPI(mockApiPort);
		app = api.createApp();
		// No extreme-warnings
		api.mockAll('1-234', {language:'nb'}, {q:'O'});
		console.log('  [mock -> init]') 
	},
	before : function() { 
		server = app.listen(mockServerPort); // Actually starting node based web app
		console.log('  [mock -> server listening on '+mockServerPort+']') 
	},
	after : function() {
		api.stopAll();
		server.close();
		console.log('  [mock -> mock teardown]') 
	},
	getAPI : function(){
		return api;
	},
	getMockServerUrl : function(){
		return 'http://localhost:'+mockServerPort+'/';
	}
};
