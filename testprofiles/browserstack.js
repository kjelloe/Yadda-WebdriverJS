// Configurator for BROWSERSTACK: https://www.browserstack.com/automate/node#setting-os-and-browser
module.exports = {
	'serverurl' : 'http://hub.browserstack.com/wd/hub', 
	'win7-ie11' : 
	{ 
		 'browser' : 'IE',
		 'browser_version' : '11.0',
		 'os' : 'Windows',
		 'os_version' : '7',
		 'resolution' : '1024x768'
	},
	'win7-ie10': 
	{ 
		 'browser' : 'IE',
		 'browser_version' : '10.0',
		 'os' : 'Windows',
		 'os_version' : '7',
		 'resolution' : '1024x768'
	},
	'win7-ie9' :
	{ 
		 'browser' : 'IE',
		 'browser_version' : '9.0',
		 'os' : 'Windows',
		 'os_version' : '7',
		 'resolution' : '1024x768'
	},
	'win7-ie8' :
	{ 
		 'browser' : 'IE',
		 'browser_version' : '8.0',
		 'os' : 'Windows',
		 'os_version' : '7',
		 'resolution' : '1024x768'
	},
	'win8-ie10' :
	{ 
		 'browser' : 'IE',
		 'browser_version' : '10.0',
		 'os' : 'Windows',
		 'os_version' : '8',
		 'resolution' : '1024x768'
	},
	'win8-ie11' :
	{ 
		 'browser' : 'IE',
		 'browser_version' : '11.0',
		 'os' : 'Windows',
		 'os_version' : '8.1',
		 'resolution' : '1024x768'
	},
	'win8-firefox' :
	{ 
		 'browser' : 'Firefox',
		 'os' : 'Windows',
		 'os_version' : '8.1',
		 'resolution' : '1024x768'
	},		
	'win8-chrome' :
	{ 
		 'browser' : 'Chrome',
		 'os' : 'Windows',
		 'os_version' : '8.1',
		 'resolution' : '1024x768'
	},		
	'win8-opera' :
	{ 
		 'browser' : 'Opera',
		 'os' : 'Windows',
		 'os_version' : '8.1',
		 'resolution' : '1024x768'
	},
	'winxp-ie7' :
	{ 
		 'browser' : 'IE',
		 'browser_version' : '7.0',
		 'os' : 'Windows',
		 'os_version' : 'XP',
		 'resolution' : '1024x768'
	},
	'mac-safari' :
	{ 
		 'browser' : 'Safari',
		 'os' : 'OS X',
		 'os_version' : 'Mavericks',
		 'resolution' : '1024x768'
	},
	'mac-chrome' :
	{ 
		'browser' : 'Chrome',
		'os' : 'OS X',
		'os_version' : 'Mavericks',
		'resolution' : '1024x768'
	},
	'mac-firefox' :
	{ 
		 'browser' : 'Firefox',
		 'os' : 'OS X',
		 'os_version' : 'Mavericks',
		 'resolution' : '1024x768'
	},
	'mac-opera' :
	{ 
		 'browser' : 'Opera',
		 'os' : 'OS X',
		 'os_version' : 'Yosemite',
		 'resolution' : '1024x768'
	},		
	'maclion-safari' :
	{ 
		 'browser' : 'Safari',
		 'os' : 'OS X',
		 'os_version' : 'Lion',
		 'resolution' : '1024x768'
	},
	'maclion-chrome' :
	{ 
		 'browser' : 'Chrome',
		 'os' : 'OS X',
		 'os_version' : 'Lion',
		 'resolution' : '1024x768'
	},
	'maclion-firefox' :
	{ 
		 'browser' : 'Firefox',
		 'os' : 'OS X',
		 'os_version' : 'Lion',
		 'resolution' : '1024x768'
	},
	'maclion-opera' :
	{ 
		 'browser' : 'Opera',
		 'os' : 'OS X',
		 'os_version' : 'Lion',
		 'resolution' : '1024x768'
	},
	'iphone6plus' :
	{ 
		'browserName' : 'iPhone',
		'platform' : 'MAC',
		'device' : 'iPhone 6 Plus',
	},
	'iphone6' :
	{ 
		'browserName' : 'iPhone',
		'platform' : 'MAC',
		'device' : 'iPhone 6',
	},
	'iphone' :
	{ 
		'browserName' : 'iPhone',
		'platform' : 'MAC',
		'device' : 'iPhone 5C',
	},
	'iphone5s' :
	{ 
		'browserName' : 'iPhone',
		'platform' : 'MAC',
		'device' : 'iPhone 5S',
	},
	'ipad' :
	{ 		 
		'browserName' : 'iPad',
		'platform' : 'MAC',
		'device' : 'iPad 4th Gen'
 	},
	'ipad-air' :
	{ 
		'browserName' : 'iPad',
		'platform' : 'MAC',
		'device' : 'iPad Air'
 	},
	'ipad-mini' :
	{ 
		'browserName' : 'iPad',
		 'platform' : 'MAC',
		 'device' : 'iPad mini Retina'
	},
	'android' :
	{ 
		 'browserName' : 'android',
		 'platform' : 'ANDROID',
		 'device' : 'Google Nexus 6'
	},
	'android-galaxy-tab' :
	{ 
		 'browserName' : 'android',
		 'platform' : 'ANDROID',
		 'device' : 'Samsung Galaxy Tab 4 10.1'
	},
	'android-galaxys5' :
	{ 
		 'browserName' : 'android',
		 'platform' : 'ANDROID',
		 'device' : 'Samsung Galaxy S5'
	},
	'android-galaxys4' :
	{ 
		 'browserName' : 'android',
		 'platform' : 'ANDROID',
		 'device' : 'Samsung Galaxy S4'
	},	
	'android-galaxys3' :
	{ 
		 'browserName' : 'android',
		 'platform' : 'ANDROID',
		 'device' : 'Samsung Galaxy S3'
	},
	'android-galaxys-note2':
	{ 
		 'browserName' : 'android',
		 'platform' : 'ANDROID',
		 'device' : 'Samsung Galaxy Note 2'
	},
	'android-nexus' :
	{ 
		 'browserName' : 'android',
		 'platform' : 'ANDROID',
		 'device' : 'Google Nexus 6'
	},
	'android-nexus-tab' :
	{ 
		 'browserName' : 'android',
		 'platform' : 'ANDROID',
		 'device' : 'Google Nexus 9'
	},
	'android-htc' :
	{ 
		'device' : 'HTC One M8',
		'os' : 'android',
		'browser' : 'android'			
	},
	'android-sony-xperia' :
	{ 
		'browserName' : 'android',
		'platform' : 'ANDROID',
		'device' : 'Sony Xperia Tipo'
	},
	'android-kindle' :
	{ 
		 'browserName' : 'android',
		 'platform' : 'ANDROID',
		 'device' : 'Amazon Kindle Fire HD 8.9'
	}
};
