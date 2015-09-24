var fs = require('fs');
var Yadda = require('yadda'); 
var webdriver = require('selenium-webdriver'); // Needs: phantomjs --webdriver=<somewebdriverport default 8001>
process.env.SELENIUM_BROWSER = 'no browser specified yet'; // WORKAROUND: For selenium webdriverjs 2.44 to avoid failing on missing browser specification when running remote
var helper = require('./bdd-helper').create(process.env);

var selectedLanguage = Yadda.localisation.Norwegian; // TODO: Config based language setting
Yadda.plugins.mocha.StepLevelPlugin.init({language: selectedLanguage}); 

var featureParser = new Yadda.parsers.FeatureFileParser(selectedLanguage);
var Dictionary = Yadda.Dictionary;
var EventBus = require('yadda').EventBus;
  
// Fetching and setting up configuration parameters
var scenarioFile = helper.getScenariosFile();
var overwriteStubFile = helper.getArgument("overwrite");
var webdriverStepsOutputFile = helper.makeStepsMappingsModule(scenarioFile, overwriteStubFile);
var webdriverStepsTemplateFile = helper.findStepsTemplateFile('template-webdriverjs-steps.js');
var Library = helper.detectLocalization(scenarioFile); 

// Yadda-webdriverjsJS mappings setup
console.log('--------------- INIT COMPLETED -------------------------------');
console.log('BDD spec/gherkin file:      ' + scenarioFile);
console.log('BDD spec/gherkin language:  ' + helper.getLocalizationName() +' NB! Use UTF8-encoding on specification text files');
console.log('webdriverjs step template file:' + webdriverStepsTemplateFile);
console.log('BDD step stub output file:  ' + webdriverStepsOutputFile);

console.log('\n--------------- GENERATING steps for features with scenarios ---------------');

try {
  // Loading and running text spec files parsed by yadda and run by Yadda
  featureParser.parse(scenarioFile, function(feature) {
    console.log('Feature  : ' + feature.title);
    var webdriverjsStepsOutput = helper.makeFeatureHeading(feature);	

    scenarios(feature.scenarios, function(scenario) {

      console.log('Scenario : ' + scenario.title);
      webdriverjsStepsOutput += helper.makeScenarioSteps(scenario.steps);		  

    });
        
    // Read template file and append step stubs
    var templateText = fs.readFileSync(webdriverStepsTemplateFile, "utf8");
    webdriverjsStepsOutput = templateText.replace("/* TEMPLATE: Steps-will-be-placed-here */", webdriverjsStepsOutput);
    fs.writeFileSync(webdriverStepsOutputFile, webdriverjsStepsOutput, "utf-8");
    // Make summary
    console.log('\n--------------- DONE--------------------------------------------------------');
    console.log('Yadda-WebdriverJs step stub file generated:\n\tfile:\n' + webdriverStepsOutputFile);
  });
}
catch(genError) {
  console.log('\nERROR WHILE GENERATING:\n Could not generate Yadda-WebdriverJs step stub file due to: ' + genError.message);
}
