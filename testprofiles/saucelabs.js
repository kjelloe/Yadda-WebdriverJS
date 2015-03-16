// Configurator for SAUCE LABS: https://docs.saucelabs.com/reference/test-configuration/ 
module.exports = {
	'serverurl' : 'http://ondemand.saucelabs.com:80/wd/hub',
	'win7-ie11' : 
	{ 
		'browserName': 'internet explorer',
		'platform' : 'Windows 7',
		'version' : '11.0'
	},
	'win7-ie10': 
	{ 
		'browserName': 'internet explorer',
		'platform' : 'Windows 7',
		'version' : '10.0'
	},
	'win7-ie9' :
	{ 
		'browserName': 'internet explorer',
		'platform' : 'Windows 7',
		'version' : '9.0'
	},
	'win7-ie8' :
	{ 
		'browserName': 'internet explorer',
		'platform' : 'Windows 7',
		'version' : '8.0'
	},
	'win8-ie10' :
	{ 
		'browserName': 'internet explorer',
		'platform' : 'Windows 8',
		'version' : '10.0'
	},
	'win8-ie11' :
	{ 
		'browserName': 'internet explorer',
		'platform' : 'Windows 8.1',
		'version' : '11.0'
	},
	'win8-firefox' :
	{ 
		'browserName': 'firefox',
		'platform' : 'Windows 8.1'
	},		
	'win8-chrome' :
	{ 
		'browserName': 'chrome',
		'platform' : 'Windows 8.1'
	},		
	'win7-opera' :
	{ 
		'browserName': 'opera',
		'platform' : 'Windows 7'
	},
	'winxp-ie7' :
	{ 
		'browserName': 'internet explorer',
		'platform' : 'Windows XP',
		'version' : '7.0'
	},
	'mac-safari' :
	{ 
		'browserName': 'safari',
		'platform' : 'OS X 10.10',
		'version' : '8.0'
	},
	'mac-chrome' :
	{ 
		'browserName': 'chrome',
		'platform' : 'OS X 10.10'
	},
	'mac-firefox' :
	{ 
		'browserName': 'firefox',
		'platform' : 'OS X 10.10'
	},
	'maclion-safari' :
	{ 
		'browserName': 'safari',
		'platform' : 'OS X 10.8'
	},
	'maclion-chrome' :
	{ 
		'browserName': 'chrome',
		'platform' : 'OS X 10.8'
	},
	'iphone' :
	{ 
		'browserName': 'iphone',
		'platform' : 'OS X 10.10',
		'version' : '8.1',
		'deviceName' : 'iPhone Simulator',
		'device-orientation' : 'portrait'
	},
	'iphone5' :
	{ 
		'browserName': 'iphone',
		'platform' : 'OS X 10.10',
		'version' : '7.1',
		'deviceName' : 'iPhone Simulator',
		'device-orientation' : 'portrait'
	},
	'iphone4' :
	{ 
		'browserName': 'iphone',
		'platform' : 'OS X 10.10',
		'version' : '6.1',
		'deviceName' : 'iPhone Simulator',
		'device-orientation' : 'portrait'
	},
	'iphone3' :
	{ 
		'browserName': 'iphone',
		'platform' : 'OS X 10.10',
		'version' : '5.1',
		'deviceName' : 'iPhone Simulator',
		'device-orientation' : 'portrait'
	},
	'ipad' :
	{ 		 
		'browserName': 'iphone',
		'platform' : 'OS X 10.10',
		'version' : '8.1',
		'deviceName' : 'iPad Simulator',
		'device-orientation' : 'landscape'
 	},
	'ipad3' :
	{ 		 
		'browserName': 'iphone',
		'platform' : 'OS X 10.10',
		'version' : '7.1',
		'deviceName' : 'iPad Simulator',
		'device-orientation' : 'landscape'
 	},
	'ipad2' :
	{ 		 
		'browserName': 'iphone',
		'platform' : 'OS X 10.10',
		'version' : '6.1',
		'deviceName' : 'iPad Simulator',
		'device-orientation' : 'landscape'
 	},
	'android' :
	{ 
		'browserName': 'android',
		'platform' : 'Linux',
		'version' : '4.4',
		'deviceName' : 'Android Emulator',
		'device-orientation' : 'portrait'
	},
	'android-galaxy-tab' :
	{ 
		'browserName': 'android',
		'platform' : 'Linux',
		'version' : '4.2',
		'deviceName' : 'Samsung Galaxy Tab 3 Emulator',
		'device-orientation' : 'portrait'
	},
	'android-galaxys4' :
	{ 
		'browserName': 'android',
		'platform' : 'Linux',
		'version' : '4.4',
		'deviceName' : 'Samsung Galaxy S4 Emulator',
		'device-orientation' : 'portrait'
	},	
	'android-galaxys3' :
	{ 
		'browserName': 'android',
		'platform' : 'Linux',
		'version' : '4.4',
		'deviceName' : 'Samsung Galaxy S3 Emulator',
		'device-orientation' : 'portrait'
	},
	'android-galaxys-note':
	{ 
		'browserName': 'android',
		'platform' : 'Linux',
		'version' : '4.1',
		'deviceName' : 'Samsung Galaxy Note Emulator',
		'device-orientation' : 'portrait'
	},
	'android-nexus' :
	{ 
		'browserName': 'android',
		'platform' : 'Linux',
		'version' : '4.4',
		'deviceName' : 'Samsung Galaxy Nexus Emulator',
		'device-orientation' : 'portrait'
	},
	'android-nexus-tab' :
	{ 
		'browserName': 'android',
		'platform' : 'Linux',
		'version' : '4.1',
		'deviceName' : 'Samsung Galaxy Note 10.1 Emulator',
		'device-orientation' : 'portrait'
	},
	'android-htc' :
	{ 
		'browserName': 'android',
		'platform' : 'Linux',
		'version' : '4.1',
		'deviceName' : 'HTC One X Emulator',
		'device-orientation' : 'portrait'		
	}
};
