var fs = require('fs')
  , fsUtils = require('recur-fs')
  , path = require('path')
  , readdir = fsUtils.readdir.sync
  , date = new Date()

var fakeProxy = require('./apioxy_embedded.js'); // NOTE: Partial reuse of apioxy but adapted to in process spawning and in memory updating of faked data
var fixtureDirectory = path.resolve(__dirname + '/fixtures');
var fakeProxyPort = parseInt(process.env.API_PROXY ? process.env.API_PROXY : 3009); // NOTE: Needs to be configured in yr frontend
var forwardProxyUrl = (process.env.API_URL_SERVER ? process.env.API_URL_SERVER : 'http://yrapi.cloudapp.net/api/v0/');

module.exports = {
  init : function(instanceCounter, fakeEndpointList) {
    if(instanceCounter===undefined) { throw new Error("Fake cannot load if there is no instance number provided to assure uniqness."); }
	if(fakeEndpointList===undefined) { throw new Error('Param "fakeEndpointList" must either be set to an actual list of endpoints to fake or explicitly set to empty array'); }

	// Starting fake proxy
	console.log('  [fake -> init]')
	console.log('  [Listening on "localhost:' + fakeProxyPort + '", forward proxying to "' + forwardProxyUrl + '"]');
	fakeProxy.init(forwardProxyUrl, fakeProxyPort, fixtureDirectory, fakeEndpointList );

	// Sample object calls using lodash-deep
	// fakeProxy.get('forecast', 'shortIntervals[0].precipitation.value');
	// fakeProxy.update('forecast', 'shortIntervals[0].precipitation.value', 5);
	// fakeProxy.every('forecast', 'shortIntervals', function(shortInt) {
	// 		fakeProxy.updateObject(shortInt, 'precipitation.value', 10);
	// });

	return this;
  },
  before : function() {
    console.log('  [fake -> before]')
  },
  after : function() {
    console.log('  [fake -> fake teardown]')
	fakeProxy.stop();
  },
  getFakedata : function() {
	return fakeProxy
  }
};
