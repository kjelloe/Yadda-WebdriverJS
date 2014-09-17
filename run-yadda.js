var Yadda = require('yadda');
var selectedLanguage = Yadda.localisation.Norwegian; // TODO: Config based language setting
Yadda.plugins.mocha.StepLevelPlugin.init({language: selectedLanguage}); 

var webdriver = require('selenium-webdriver'); // Needs: phantomjs --webdriver=8001
var library = require('./library').init(selectedLanguage);

var fs = require('fs');
var driver;

// Finding which test environment to use
var listEnvironments = require('./config').init();
var testEnv = (process.env.testenv? process.env.testenv : 'default');
console.log('Using test environment: "' + testEnv + '"');
var capabilities = listEnvironments[testEnv];
if(!capabilities) { throw new Error('Invalid "testenv" provided: ' + testEnv); }

// Finding test group (folders) to use
var testGroup = (process.env.testgroup? 'features/'+process.env.testgroup +'/' : 'features');

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
		
        before(function(done) {
			driver = new webdriver.Builder()
				.usingServer(capabilities.serverurl)
				.withCapabilities(capabilities)
				.build();
			driver.manage().timeouts().implicitlyWait(3000);
			var assertHelper = require('./assertHelper').init(driver); // Load assert helper for easier webdriverjs assertions			
			require("./"+stepFile).steps.using(library, { driver: driver, assert : assertHelper });						
			done();			
        });

        scenarios(feature.scenarios, function(scenario) {			
            steps(scenario.steps, function(step, done) {
                executeInFlow(function() {					
					var assertHelper = require('./assertHelper').init(driver); // Load assert helper for easier webdriverjs assertions			
                    new Yadda.Yadda(library, { driver: driver }).yadda(step);
                }, done);
            });
        });

        afterEach(function() {
            takeScreenshotOnFailure(this.currentTest);
        });

        after(function(done) {
            driver.quit().then(done);
        });
    });
});

function executeInFlow(fn, done) {
    webdriver.promise.controlFlow().execute(fn).then(function() {
        done();
    }, done);
}

function takeScreenshotOnFailure(test) {
    if (test.status != 'passed') {
        var path = 'screenshots/' + test.title.replace(/\W+/g, '_').toLowerCase() + '.png';
        driver.takeScreenshot().then(function(data) {
            fs.writeFileSync(path, data, 'base64');
        });
    }
}
