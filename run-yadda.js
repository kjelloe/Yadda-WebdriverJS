var Yadda = require('yadda');
var fs = require('fs');
var webdriver = require('selenium-webdriver'); // Needs: phantomjs --webdriver=8001
process.env.SELENIUM_BROWSER = 'no browser specified yet'; // WORKAROUND: For selenium webdriverjs 2.44 to avoid failing on missing browser specification when running remote

var selectedLanguage = Yadda.localisation.Norwegian; // TODO: Config based language setting
Yadda.plugins.mocha.StepLevelPlugin.init({language: selectedLanguage}); 
// Loading helper libs
var library = require('./library').init(selectedLanguage);
var utility = require('./utility').init(); 
var driver;

// Finding test url to use
var testurl = (process.env.testurl? process.env.testurl : null);
if(testurl==null) { throw new Error('ERROR: No test url provided for test. Required:'); }
if(testurl.endsWith('/')==false) { testurl += '/'; }
console.log('Using testurl "'+testurl+'"');

// Finding which test environment to use and configure all available profiles
var isLocalTestUrl = (testurl.toLowerCase().indexOf('http://localhost')==0? true : false);
var testConfig = require('./config').init(process.env.BROWSERSTACK_USER, process.env.BROWSERSTACK_KEY, isLocalTestUrl);
var testEnv = (process.env.testenv? process.env.testenv : 'default');
console.log('Using test environment: "' + testEnv + '"');
var capabilities = testConfig.getTestProfile(testEnv);
if(!capabilities) { throw new Error('Invalid "testenv" provided: ' + testEnv); }

// Finding test group (folders) to use
var testGroup = (process.env.testgroup? 'features/'+process.env.testgroup +'/' : 'features');

// Find any additional process parameters
var process_timeout = parseInt(process.env.timeout? process.env.timeout : 6000);
var process_mockspath = (process.env.mockspath? process.env.mockspath : './mocks/'); 
var process_loadTimeout = (process_timeout*5);

// Find all feature files, with corresponding step file, then executing them using Mocha
var listFeatures = new Yadda.FeatureFileSearch(testGroup);

if(listFeatures.list().length==0) // Force test failure if no tests found
	throw new Error('ERROR: No feature files found for testgroup "'+testGroup+'"');
else
	console.log('Found '+listFeatures.list().length+' feature file(s) using test group/folder: "' + testGroup + '"');

// Run each feature file found using mocha
listFeatures.each(function(file) {
	var stepFile = file.replace('.feature', '-steps.js');

    featureFile(file, function(feature) {
	
		var mockDataModule = new Object(); // Default to empty mock data		
		var assertHelper;
		// TODO: Run in parallell webdriver session (up to NN account restrictions) and give each session feature as name
		capabilities.name = 'Testgroup "'+ testGroup + '"'; 
		
		before(function(done) {
			console.log('  [File: "' + file + '"]');	
			
			if(feature.annotations.custommockmodule) {
				mockDataModule = loadCustomMockDataModule(feature.annotations.custommockmodule);
				if(mockDataModule.before) mockDataModule.before();
			}
			
			driver = new webdriver.Builder()
				.usingServer(capabilities.serverurl)
				.setLoggingPrefs( {'driver': 'ALL', 'server': 'ALL', 'browser': 'ALL'} )
				.withCapabilities(capabilities)
				.build();
						
			// Not implemented at browserstack yet; driver.manage().timeouts().pageLoadTimeout(process_loadTimeout);  // Set timeouts
			// Not implemented at browserstack yet; driver.manage().timeouts().setScriptTimeout(process_loadTimeout);
			driver.manage().timeouts().implicitlyWait(process_timeout);
			
			assertHelper = require('./assertHelper').init(driver); // Set up assert helper for easier webdriverjs assertions						
			require("./"+stepFile).steps.using(library, { driver: driver, assert : assertHelper, testUrl: testurl, custommockmodule: mockDataModule });						
			
			done();			
        });

		beforeEach(function() {
			if(mockDataModule.beforeEach) mockDataModule.beforeEach();
		});
		
        scenarios(feature.scenarios, function(scenario) {			
            steps(scenario.steps, function(step, done) {				
                executeInFlow(function() {					
					new Yadda.Yadda(library, { driver: driver }).yadda(step);
                }, done);
            });
        });
	
        afterEach(function() {
			if(mockDataModule.afterEach) mockDataModule.afterEach();            
			takeTestScreenshotAsync(driver, this.currentTest)
			.then( function(screenShotDone) { 
			
			});
        });

        after(function(done) {
			if(mockDataModule.after) mockDataModule.after();
			
			getLogOutputIfAny(driver, capabilities.logType);
			
			// Async quit when all other tasks are done
			executeInFlow(function() {					
				driver.quit();
			}, done);
			
        });
    });
});

function executeInFlow(fn, done) {
    webdriver.promise.controlFlow().execute(fn).then(function() {
        done();
    }, done);
}

function takeTestScreenshotAsync(testDriver, test) {
	var done = webdriver.promise.defer();
	var path = utility.getWorkingDir() + '/results/screenshots/'+ (test.state != 'passed' ? 'failed/' : 'passed/');
	utility.createDirIfNotExists(path).then( function() {
		var filepath = path + test.title.replace(/\W+/g, '_').toLowerCase() + '-' + testEnv + '.png';
		testDriver.takeScreenshot().then(function(data) {
			fs.writeFileSync(filepath, data, 'base64');
		}).then( function() {
			performHtmlDump(testDriver, test);
		}).then( function() {
			done.fulfill();
		});
	});
	return done.promise;
}

function performHtmlDump(testDriver, test) {
	var path = utility.getWorkingDir() + '/results/htmldump/'+ (test.state != 'passed' ? 'failed/' : 'passed/');
	utility.createDirIfNotExists(path).then( function() {
		var filepath = path + test.title.replace(/\W+/g, '_').toLowerCase() + '-' + testEnv + '.html';
		testDriver.getPageSource().then(function(html) {
			fs.writeFileSync(filepath, html, 'utf8');
		});
	});
}

// NOTE: For phantomjs either browser or har are available as log output: http://phantomjs.org/network-monitoring.html
function getLogOutputIfAny(driver, logType) {
	if(logType && typeof logType === 'string') {
		driver.manage().logs().get(logType).then( function(logs) {
			formatLogOutput(logs);
		});
	}
}

function formatLogOutput(logs) {
	if(logs!==undefined && logs.length>0) {
		console.log('  [From client console:')
		for(var i=0;i<logs.length;i++) { console.log('   '+ (i+1) +': ' + logs[i].level.name + ':' + logs[i].message ); }					
		console.log('  ]')
	}
}

function loadCustomMockDataModule(customMockModule) {
	var mockDataPath = process_mockspath + customMockModule;
	console.log('  [@customMockModule -> Invoking custom mock data setup from file: "'+ mockDataPath + '"]');				
	var mockDataModule = require(mockDataPath);	
	
	var mockDataHooks = ''; 	
	for(var prop in mockDataModule) { mockDataHooks += ',' + prop; }	
	
	console.log('  [@customMockModule -> Methods/hooks provided by module: "' + (mockDataHooks.length>0? mockDataHooks.substring(1) : 'NONE!') + '"]');
	if(mockDataModule.init) mockDataModule.init();
	return mockDataModule;
}
