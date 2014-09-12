// Setting up test environment configurations
module.exports = {
    init: function () {
		var listEnvironments = new Array();
		listEnvironments['default'] = listEnvironments['phantomjs'] = {'browserName': 'phantomjs', 'serverurl': 'http://localhost:8001'};
		listEnvironments['windows7'] = 
		{ 'os' : 'Windows',
		  'os_version' : '7',
		  'browser' : 'internet explorer', 
		  'browser_version': '10',
		  'browserstack.user' : 'USERNAME_HERE',
		  'browserstack.key' : 'PASSWORD_HERE',
		  'browserstack.local' : false,
		  'browserstack.debug' : true,
		  'serverurl' : 'http://hub.browserstack.com/wd/hub'
		};
		listEnvironments['android'] = 
		{ 'browser' : 'android',
		  'browserstack.user' : 'USERNAME_HERE',
		  'browserstack.key' : 'PASSWORD_HERE',
		  'browserstack.local' : false,
		  'browserstack.debug' : true,
		  'serverurl' : 'http://hub.browserstack.com/wd/hub'
		};
		return listEnvironments;
	}
};
