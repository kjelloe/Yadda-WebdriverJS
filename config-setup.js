// Creating configurations available for crossbrowser testing; either browserstack.com or saucelabs.com
var testEnvironments = {};

// NRK required browser support, category 1: http://www.nrk.no/retningslinjer/nettleserstotte-i-nrk-1.777525
module.exports = {

	init: function (testProfilesConfigFilepath, testServiceUser, testServiceAccessKey, webdriverUri, localTestUrl, testDebug) {

		// Helper: parse address 
		_getHostAddress = function(uri, defaultHost, defaultPort) {
			var addr = new Object();
			if(uri===undefined) { // If no uri, use default
				addr.protocol = 'http://';
				addr.port = defaultPort;
				addr.host = defaultHost;
			} else { // Otherwise parse provided uri
				var uriSplit = uri.replace(/http:\/\/|https:\/\//,'').split(':', 2);
				addr.protocol = (uri.toLowerCase().indexOf('https')==0? 'https://' : 'http://');
				if(uriSplit.length==0) {
					throw new Error("Invalid webdriveruri specified:" + uri);
				} else if(uriSplit.length<2) {
					addr.port = defaultPort;
				} else {
					addr.port = uriSplit[1];
				}
				addr.host = uriSplit[0];
			}
			return addr.protocol + addr.host + ':' + addr.port;
		};
	
		// Setting up default test environment configuration supporting both Browserstack and SauceLabs parameters
		var defaultSettings = {
			'browserstack.user' : testServiceUser,
			'browserstack.key' : testServiceAccessKey,
			'browserstack.local' : (localTestUrl===undefined? false : localTestUrl),
			'browserstack.debug' : (testDebug===undefined? true : testDebug),
			'username': testServiceUser, 
			'accessKey': testServiceAccessKey, 
			'webdriveruri' : _getHostAddress(webdriverUri, 'localhost', 8001),
			'name': 'Test uten navn satt',
			'project': 'Yr2014 brukerhistorietester',
			'logType' : false
		};
		
		// Loading requested test profiles
		testEnvironments = require(testProfilesConfigFilepath);
		// Add some required settings from vendor specific test service
		defaultSettings.serverurl = testEnvironments.serverurl;
		// Add default profile
		testEnvironments['default'] = testEnvironments['phantomjs'] = {'browserName': 'phantomjs', 'serverurl': defaultSettings.webdriveruri, 'logType' : 'browser', 'desc' : 'Phantomjs via webdriver on ' + defaultSettings.webdriveruri};
		// Adding default config data if not specified for test environments
		for(var testenv in testEnvironments) 
			for(var defaultProp in defaultSettings) 
				if(testEnvironments[testenv][defaultProp]===undefined) 
					testEnvironments[testenv][defaultProp] = defaultSettings[defaultProp]; 
		
		return this;
	},
	// Get all test profiles
	getTestProfile: function(profileName) {
		return testEnvironments[profileName];
	},
	// List all profiles by start of profile name
	getTestProfilesMatching : function(startOfProfileName) {
		var matches = new Array();
		for(var testenv in testEnvironments) {
			if(testenv.indexOf(startOfProfileName)==0 || startOfProfileName===undefined)
				matches[testenv] = testEnvironments[testenv];
		}
		return matches;		
	}
};
