var Yadda = require('yadda');
Yadda.plugins.mocha.StepLevelPlugin.init({language: Yadda.localisation.Norwegian}); // TODO: Config based language setting

var webdriver = require('selenium-webdriver'); // Needs: phantomjs --webdriver=8001
var library = require('./library').init();

var fs = require('fs');
var driver;

// Finding which test environment to use
var listEnvironments = require('./config').init();
var testEnv = (process.env.testenv? process.env.testenv : 'default');
console.log('Using test environment: "' + testEnv + '"');
var capabilities = listEnvironments[testEnv];
if(!capabilities) { throw new Error('Invalid "testenv" provided: ' + testEnv); }

// Find all feature files, with corresponding step file, then executing them using Mocha
// TODO: grouping of tests pr folder below  test
new Yadda.FeatureFileSearch('features').each(function(file) {

	var stepFile = file.replace('.feature', '-steps.js');
	
    featureFile(file, function(feature) {
		
        before(function(done) {
			driver = new webdriver.Builder()
				.usingServer(capabilities.serverurl)
				.withCapabilities(capabilities)
				.build();
			driver.manage().timeouts().implicitlyWait(15000);
			require("./"+stepFile).steps.using(library, { driver: driver });						
			done();			
        });

        scenarios(feature.scenarios, function(scenario) {			
            steps(scenario.steps, function(step, done) {
                executeInFlow(function() {					
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
