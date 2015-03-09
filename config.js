// Creating configurations available for crossbrowser testing
var testEnvironments = new Array(); 

// NRK required browser support, category 1: http://www.nrk.no/retningslinjer/nettleserstotte-i-nrk-1.7775258
module.exports = {

	init: function (browserStackUser, browserStackAccessKey, webdriverUri, localTestUrl, testDebug) {

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
	
		// Setting up default test environment configuration 
		var defaultSettings = {
			'browserstack.user' : browserStackUser,
			'browserstack.key' : browserStackAccessKey,
			'browserstack.local' : (localTestUrl===undefined? false : localTestUrl),
			'browserstack.debug' : (testDebug===undefined? true : testDebug),
			'webdriveruri' : _getHostAddress(webdriverUri, 'localhost', 8001),
			'serverurl' : 'http://hub.browserstack.com/wd/hub',
			'name': 'Test uten navn satt',
			'project': 'Yr2014 brukerhistorietester',
			'logType' : false
		};
		
		// Setting up all test profiles
		testEnvironments['default'] = testEnvironments['phantomjs'] = {'browserName': 'phantomjs', 'serverurl': defaultSettings.webdriveruri, 'logType' : 'browser', 'desc' : 'Phantomjs via webdriver on ' + defaultSettings.webdriveruri};
		testEnvironments['win7-ie11'] = 
		{ 
			'os' : 'Windows',
			'os_version' : '7',
			'browser' : 'internet explorer', 
			'browser_version': '11'
		};
		testEnvironments['win7-ie10'] = 
		{ 
			'os' : 'Windows',
			'os_version' : '7',
			'browser' : 'internet explorer', 
			'browser_version': '10'
		};
		testEnvironments['win7-ie9'] = 
		{ 
			'os' : 'Windows',
			'os_version' : '7',
			'browser' : 'internet explorer', 
			'browser_version': '9'
		};
		testEnvironments['win7-ie8'] = 
		{ 
			'os' : 'Windows',
			'os_version' : '7',
			'browser' : 'internet explorer', 
			'browser_version': '8'
		};
		testEnvironments['win8-ie10'] = 
		{ 
			'os' : 'Windows',
			'os_version' : '8',
			'browser' : 'internet explorer', 
			'browser_version': '10'
		};
		testEnvironments['win8-ie11'] = 
		{ 
			'os' : 'Windows',
			'os_version' : '8.1',
			'browser' : 'internet explorer', 
			'browser_version': '11'
		};
		testEnvironments['win8-firefox'] = 
		{ 
			'os' : 'Windows',
			'os_version' : '8.1',
			'browser' : 'firefox'
		};		
		testEnvironments['win8-chrome'] = 
		{ 
			'os' : 'Windows',
			'os_version' : '8.1',
			'browser' : 'chrome'
		};		
		testEnvironments['win8-opera'] = 
		{ 
			'os' : 'Windows',
			'os_version' : '8.1',
			'browser' : 'opera'
		};
		testEnvironments['winxp-ie7'] = 
		{ 
			'os' : 'Windows',
			'os_version' : 'xp',
			'browser' : 'internet explorer', 
			'browser_version': '7'
		};
		testEnvironments['mac-safari'] = 
		{ 
			'os' : 'OS X',
			'os_version' : 'Mavericks',
			'browser' : 'safari'
		};
		testEnvironments['mac-chrome'] = 
		{ 
			'os' : 'OS X',
			'os_version' : 'Mavericks',
			'browser' : 'chrome'
		};
		testEnvironments['mac-firefox'] = 
		{ 
			'os' : 'OS X',
			'os_version' : 'Mavericks',
			'browser' : 'firefox'
		};
		testEnvironments['mac-opera'] = 
		{ 
			'os' : 'OS X',
			'browser' : 'opera'
		};		
		testEnvironments['maclion-safari'] = 
		{ 
			'os' : 'OS X',
			'os_version' : 'Lion',
			'browser' : 'safari'
		};
		testEnvironments['maclion-chrome'] = 
		{ 
			'os' : 'OS X',
			'os_version' : 'Lion',
			'browser' : 'chrome'
		};
		testEnvironments['maclion-firefox'] = 
		{ 
			'os' : 'OS X',
			'os_version' : 'Lion',
			'browser' : 'firefox'
		};
		testEnvironments['maclion-opera'] = 
		{ 
			'os' : 'OS X',
			'os_version' : 'Lion',
			'browser' : 'opera'
		};
		testEnvironments['iphone6plus'] = 
		{ 
			'device' : 'iPhone 6 Plus',
			'os' : 'ios',
			'browser': 'iphone'
		};
		testEnvironments['iphone6'] = 
		{ 
			'device' : 'iPhone 6',
			'os' : 'ios',
			'browser': 'iphone'
		};
		testEnvironments['iphone'] = 
		{ 
			'device' : 'iPhone 5C',
			'os' : 'ios',
			'browser': 'iphone'
		};
		testEnvironments['iphone5s'] = 
		{ 
			'device' : 'iPhone 5S',
			'os' : 'ios',
			'browser': 'iphone'
		};
		testEnvironments['ipad'] = 
		{ 
			'device' : 'iPad mini Retina',
			'os' : 'ios',
			'browser' : 'iPad',
			'deviceOrientation' : 'portrait'
		};
		testEnvironments['ipad-air'] = 
		{ 
			'device' : 'iPad Air',
			'os' : 'ios',
			'browser' : 'iPad',
			'deviceOrientation' : 'landscape'
		};
		testEnvironments['ipad-mini'] = 
		{ 
			'device' : 'iPad mini Retina',
			'os' : 'ios',
			'browser' : 'iPad',
			'deviceOrientation' : 'portrait'
		};
		testEnvironments['android'] = 
		{ 
			'browser' : 'android'
		};
		testEnvironments['android-galaxy-tab'] = 
		{ 
			'device' : 'Samsung Galaxy Tab 4 10.1'
		};
		testEnvironments['android-galaxys3'] = 
		{ 
			'device' : 'Samsung Galaxy S III'
		};
		testEnvironments['android-galaxys2'] = 
		{ 
			'device' : 'Samsung Galaxy S2'
		};
		testEnvironments['android-galaxys-note2'] = 
		{ 
			'device' : 'Samsung Galaxy Note 2'
		};
		testEnvironments['android-galaxys5'] = 
		{ 
			'device' : 'Samsung Galaxy S5'
		};
		testEnvironments['android-nexus'] = 
		{ 
			'device' : 'Google Nexus 9'
		};
		testEnvironments['android-htc'] = 
		{ 
			'device' : 'HTC One M8',
			'os' : 'android',
			'browser' : 'android'			
		};
		testEnvironments['android-sony-xperia'] = 
		{ 
			'device' : 'Sony Xperia Tipo'
		};
		testEnvironments['android-kindle'] = 
		{ 
			'device' : 'Amazon Kindle Fire HDX 7'
		};
		
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
