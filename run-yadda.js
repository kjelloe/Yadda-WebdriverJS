var Yadda = require('yadda');
var fs = require('fs');
var webdriver = require('selenium-webdriver'); // Needs: phantomjs --webdriver=<somewebdriverport default 8001>
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

// Find optional process parameters
var process_timeout = parseInt(process.env.timeout? process.env.timeout : 6000);
var process_testprofiles = (process.env.testprofiles? process.env.testprofiles : './testprofiles/browserstack'); 
var process_mockspath = (process.env.mockspath? process.env.mockspath : './mocks/'); 
var process_windowsize = (process.env.windowsize? process.env.windowsize : null); 
var process_loadTimeout = (process_timeout*5);

// Finding which test environment to use and configure all available profiles
var isLocalTestUrl = (testurl.toLowerCase().indexOf('http://localhost')==0? true : false);
var testConfig = require('./config-setup').init(process_testprofiles, process.env.TESTSERVICE_USER, process.env.TESTSERVICE_ACCESSKEY, process.env.WEBDRIVERURI, isLocalTestUrl, process.env.DEBUGMODE);
var testEnv = (process.env.testenv? process.env.testenv : 'default');
console.log('Using test environment: "' + testEnv + '" from testprofiles defined in "'+process_testprofiles+'"');
var capabilities = testConfig.getTestProfile(testEnv);
if(!capabilities) { throw new Error('Invalid "testenv" provided: ' + testEnv); }

// Finding test group (folders) to use
var testGroup = (process.env.testgroup? 'features/'+process.env.testgroup +'/' : 'features');

// Find all feature files, with corresponding step file, then executing them using Mocha
var listFeatures = new Yadda.FeatureFileSearch(testGroup);

if(listFeatures.list().length==0) // Force test failure if no tests found
  throw new Error('ERROR: No feature files found for testgroup "'+testGroup+'"');
else
  console.log('Found '+listFeatures.list().length+' feature file(s) using test group/folder: "' + testGroup + '"');

// A running count of test instances created, use for unique identification or ports
var testInstanceCounter = 0; 

// Run each feature file found using mocha
listFeatures.each(function(file) {
  var stepFile = file.replace('.feature', '-steps.js');

    featureFile(file, function(feature) {
  
    var mockDataModule = new Object(); // Default to empty mock data				
    var assertHelper;
    // TODO: Run in parallell webdriver session (up to NN account restrictions) and give each session feature as name
    capabilities.name = 'Testgroup "'+ testGroup + '"'; 
    process.env.SELENIUM_BROWSER = capabilities.browserName; // Set environment variables based on selected config
    
    if(feature.annotations.runonlyfortestprofile) { // If any annotation specifying to exclusively run test for a specific profile, abort for all other profiles 			
      if(feature.annotations.runonlyfortestprofile!=testEnv) {
        console.log('  [WARNING] Skipping feature "' + feature.title +'" for test profile "' + testEnv + '" since "runonlyfortestprofile='+feature.annotations.runonlyfortestprofile+'" annotation is specified in feature file.');
        return; 
      }
    }
    
    before(function(done) {
      console.log('  [File: "' + file + '"]');	
      testInstanceCounter++; // Count pr feature
      
      if(feature.annotations.custommockmodule) {
        mockDataModule = loadCustomMockDataModule(testInstanceCounter, feature.annotations.custommockmodule);
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
      
      if(process_windowsize!==null) { setWindowSizeIfPossible(process.env.SELENIUM_BROWSER, process_windowsize); } // Setting windows size if applicable
      
      assertHelper = require('./assertHelper').init(driver); // Set up assert helper for easier webdriverjs assertions						
      require("./"+stepFile).steps.using(library, { driver: driver, assert : assertHelper, helper: assertHelper, testUrl: testurl, custommockmodule: mockDataModule });						

      // Checking for any custom cookies to load for test
      loadCustomCookie(feature.annotations.customcookie).then( function() {
        done();
      });
        });

    beforeEach(function() {
      if(mockDataModule.beforeEach) mockDataModule.beforeEach();
    });
    
        scenarios(feature.scenarios, function(scenario) {
            steps(scenario.steps, function(step, done) {
                executeInFlow(function() {
          try {
            new Yadda.Yadda(library, { driver: driver }).yadda(step);
          } catch(testError) {
            console.log(testError)
            throw new Error(testError);
          }
                }, done);
            });
        });
  
        afterEach(function() {
      if(mockDataModule.afterEach) mockDataModule.afterEach();
      var localTest = this.currentTest;
      // Async screenshot to ensure a proper flow
      webdriver.promise.controlFlow().execute( function() {
        takeTestScreenshotAsync(driver, localTest);
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
    filepath = filepath.replace(/\//,'\\'); // Cleaning up path separators
    if(test.state != 'passed') { console.log('  [Screenshot: "'+filepath+'" ]'); } // Log screenshot if failure only
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
    for(var i=0;i<logs.length;i++) {
      console.log('   '+ (i+1) +': ' + logs[i].level.name + ':' + formatLogMessage(logs[i].message)); 
    }
    console.log('  ]')
  }
}

function formatLogMessage(logMsgObject) {
  try {
    return JSON.stringify(logMsgObject)
  }
  catch(err1) {
    return '(Failed to stringify, raw object: '+ logMsgObject +')'
  }
}

function loadCustomMockDataModule(instanceCounter, customMockModule) {
  var mockDataPath = process_mockspath + customMockModule;
  console.log('  [@customMockModule -> Invoking custom mock data setup from file: "'+ mockDataPath + '"]');				
  var mockDataModule = require(mockDataPath);	
  
  var mockDataHooks = ''; 	
  for(var prop in mockDataModule) { mockDataHooks += ',' + prop; }	
  
  console.log('  [@customMockModule -> Methods/hooks provided by module: "' + (mockDataHooks.length>0? mockDataHooks.substring(1) : 'NONE!') + '"]');
  if(mockDataModule.init) mockDataModule.init(instanceCounter);
  return mockDataModule;
}

function loadCustomCookie(customCookieData) {
  var cookieDone = webdriver.promise.defer();
  // If no cookie data, abort further processing
  if(customCookieData===undefined) {
    cookieDone.fulfill();
    return cookieDone.promise;
  }
  // Parsing raw cookie data from text
  var rawData = customCookieData.split(';',2)
  if(rawData.length<2)  { throw new Error("ERROR: @customcookie needs to contain '<cookiename>';<cookievalue>'"); }
  // Adding cookie with default path and using testurl host part as domain
  driver.manage().addCookie(rawData[0], rawData[1], '/', parseUrl(testurl).host);
  // List all loaded cookies
  driver.manage().getCookies().then( function(cookieList) {
    var cookieNameList = '';
    for(var i=0;i<cookieList.length;i++) { 	cookieNameList += ',' + cookieList[i].name; }
    console.log('  [@customcookie -> Loaded cookies: "'+ (cookieNameList.length>0? cookieNameList.substring(1) : 'NONE!') + '"]');
    cookieDone.fulfill();
  });
  return cookieDone.promise;
}

function setWindowSizeIfPossible(browserName, sizeString) {
  var sizeData = sizeString.toLowerCase().split('x',2);
  
  if(sizeData.length<2 || isInt(sizeData[0])==false || isInt(sizeData[1])==false)
    throw new Error('ERROR: Window size parameter provided is invalid: "'+sizeString+'". Must be on the form "1280x1024"');
  
  var winSizeDone = webdriver.promise.defer();
  webdriver.promise.controlFlow().on('uncaughtException', function(winSizeErr) {
    console.log('WARNING: Could not set windows size for browser "'+browserName+'", reason: ' + winSizeErr.message);
    winSizeDone.fulfill();
  });
  
  driver.manage().window().setSize(parseInt(sizeData[0]),parseInt(sizeData[1])).then( function() {
    winSizeDone.fulfill();
  });
  
  return winSizeDone.promise;
}
// Helpers functions below // TODO: Refactor into util library
function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}

function parseUrl(href) {
    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7]
    }
}
