var fs = require('fs');
var path = require('path');
var Yadda = require('yadda'); 

// Extend string to contain a format function
String.prototype.format = function () {
	var formatted = this;
	for (var i = 0; i < arguments.length; i++) {
		var regexp = new RegExp('\\{'+i+'\\}', 'gi');
		formatted = formatted.replace(regexp, arguments[i]);
	}
	return formatted;
};

String.prototype.trim = function() {
	return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

module.exports.create = function(processEnv) {

	var self = this;
	var _env = processEnv;
	var _localization = 'NONE';
	var _suffixStepsfile = '-steps.js';
	var _suffixSpecfile = '.txt';

	self.getLocalizationName = function() {
		return _localization;
	}
	
	self.setLocalization = function(lang) {
		switch(lang.toLowerCase()) {
			case 'en':
			case 'english':
				_localization = 'English';
				return (Yadda.localisation.English.library || Yadda.localisation.English); // Add language as either yadda 0.7.x or 0.8.x
			default:
				_localization = 'Norwegian';
				return (Yadda.localisation.Norwegian.library || Yadda.localisation.Norwegian);// Add language as either yadda 0.7.x or 0.8.x
		}
	}
	
	self.detectLocalization = function(scenarioFile) {
		var lang = self.getArgument('lang');		
		if(lang!==undefined) {
			return self.setLocalization(lang);
		}
		else if(scenarioFile!==undefined) {
			var scenarioText = readScenarioTextFile(scenarioFile);
			if(scenarioText.search(/(Given|given|When|whenThen|then)/) != -1)
				return self.setLocalization('en');				
			else if(scenarioText.search(/(Gitt|gitt|Når|når|Så|så)/) != -1) 
				return self.setLocalization('no');
			else 
				throw new Error("Scenario file found, but no supported language detected. Which language is scenario and steps written in?");
		}
		throw new Error("No scenario file found and 'process.env.lang' argument not specified. Cannot detect language");
	}

	self.getCurrentScriptPath = function() {
		var scriptPath = path.resolve(__dirname);
		return scriptPath.substr(0,scriptPath.lastIndexOf('/')+1);
	}

	self.getPathRelativeToScriptLocation = function(someFilePathpath) {
		return path.resolve(someFilePathpath).replace(self.getCurrentScriptPath(),'');
	}

	self.findStepsMappingsModule = function(scenariosFile) {
		var stepfile = scenariosFile.substring(0,scenariosFile.lastIndexOf('.')) + _suffixStepsfile;	
		
		if(fs.exists(stepfile)==false)
			throw new Error("For each each spec-file a matching \"step.js\" js-file must be provided with the webdriverjs-intepretations. Could not find expected file: " + stepfile);
			
		return self.getPathRelativeToScriptLocation(stepfile);
	}
	
	self.makeStepsMappingsModule = function(scenariosFile, allowOverwrite) {
		var stepfile = scenariosFile.substring(0,scenariosFile.lastIndexOf('.')) + _suffixStepsfile;	
		
		if(fs.exists(stepfile) && allowOverwrite!==true)
			throw new Error("\n\nWARNING!\nStep-file for specification already exists: {0} \nPlease delete or rename before generating a new stub, or use 'process.env.overwrite' argument to overwrite existing file".format(stepfile));
			
		return self.getPathRelativeToScriptLocation(stepfile);
	}

	self.findStepsTemplateFile = function(templateFilename) {
		var templateFile = self.getCurrentScriptPath() + templateFilename;	

		if(fs.exists(templateFile)==false)
			throw new Error("WARNING: Could not find steps template file \"{0}\". Required for stubs generator to work.".format(templateFile));
		
		return path.resolve(templateFile);
	}
	
	self.readScenarioTextFile = function(file) {
		return fs.readFileSync(file, "utf8");
	}

	self.getArgument = function(argName) {
		var arg = _env[argName]; 
		if(arg===undefined)
			throw new Error('Process argument "'+argName+'" was not provided in process.env. Cannot fetch');
		return arg;
	}
	
	self.getScenariosFile = function() {
		var specfilePath = self.getArgument("specfile"); 
		
		if(specfilePath===undefined) 
			throw new Error("Parameter \"process.env.specfile\" is required. Should point to specification file to run.");
			
		if(self.isStepsFile(specfilePath)==true) // If stepfile is put in to run, be semi-smart and try to find spec file instead
			return self.findScenarioFileFromStepsFile(specfilePath)

		return specfilePath
	}
	
	// TODO: Check for other file types with matching file name, without the steps-suffix
	self.findScenarioFileFromStepsFile = function(stepsFile) {
		return stepsFile.substr(0, stepsFile.lastIndexOf(_suffixStepsfile)) + _suffixSpecfile; 
	}

	self.isStepsFile = function(filePath) {
		return (filePath.indexOf(_suffixStepsfile, filePath.length - _suffixStepsfile.length) !== -1);
	}

	self.getTestUrl = function(scenarioFile) {
		var testUrlParam = self.getArgument("testUrl"); 
		
		if(testUrlParam===undefined) 
			throw new Error("Parameter \"process.env.testUrl\" is required. Should contain (default) url for which the tests should run.");

		if(testUrlParam.indexOf('@')==0 && scenarioFile!==undefined) 
			return self.getAnnotatedParameter(scenarioFile, testUrlParam);

		return testUrlParam
	}
	
	self.getAnnotatedParameter = function(scenarioFile, paramName) {
		var scenarioText = self.readScenarioTextFile(scenarioFile);
		var paramStart = scenarioText.indexOf(paramName);		
		if(paramStart==-1) 
			throw new Error("Annotation parameter \"{0}\" was provided, but could not be found in scenario file. Required. Should contain (default) url for which the tests should run. Or use commandline 'testUrl' paramater instead. ".format(paramName));

		var regexParam = new RegExp(paramName+'([^ ,@$\n]*)?','im');
		var matchParam = scenarioText.match(regexParam);		
		if(matchParam.length==0)
			throw new Error("Could not find a valid value for parameter \"{0}\" provided ".format(paramName));

		return matchParam[0].substr(paramName.length+1).trim();
	}

	self.findStartingVerb = function(specVerb, previousVerb)  {
		if( specVerb.search(/(Given|given|Gitt|gitt|When|when|Når|når|Then|then|Så|så)/) != -1) // If any of the allowed verbs found
			return specVerb.toLowerCase();
		else if(previousVerb!==undefined && specVerb.search(/(And|and|Og|og|But|but|Men|men)/) != -1) // If conjunction "and" or "but" used in step, use previous verb if any
			return previousVerb.toLowerCase();			
		throw new Error('WARNING: BDD specification error: Step sentences must start with Given, When or Then in a support locale. Current starting word \"{0}\" is not supported'.format(specVerb));
	}

	self.makeStepStubMessage = function(errorMessage) {
		var specText = errorMessage.substr(errorMessage.indexOf('[')+1); 
		specText = specText.substr(0, specText.lastIndexOf(']'));
		var stubMessage = "\nMISSING STEP?\nIt seems like a step definition is missing for the provided scenario text: \"{0}\" \n\nThis step needs to be defined in the form of a assertion similar to the following stub:".format(specText);
		stubMessage += self.makeStepExample(specText);
		return stubMessage;
	}
	
	self.makeStepExample = function(scenarioStepText) {
		var specVerb = self.findStepVerb(scenarioStepText);
		var specExpression = self.findStepExpression(scenarioStepText);
		var stubFormatted = "\n\n\t.{1}(\"{0}\", function() {\n\t\t// Implement webdriverjs step, for example:\n\t\tctx.assert.visibleElement('some-css-selector', 'The DOM object we looked for was found');\n\t\t// Or open a web page using:\n\t\tctx.driver.get('http://someurl');\n\t})\n\n".format(specExpression, specVerb);
		return stubFormatted;
	}
	
	self.makeStepStub = function(scenarioStepText, previousVerb) {
		var specVerb = self.findStepVerb(scenarioStepText, previousVerb);
		var specExpression = self.findStepExpression(scenarioStepText);
		var testHint = self.makeTestHint(specExpression);
		var stubFormatted = "\n\t\tlibrary.{1}(\"{0}\", function() {\n\t\t\t// TODO: Implement step, i.e: {2};\n\t\t})".format(specExpression, specVerb, testHint);
		return stubFormatted;
	}
	
	self.makeTestHint = function(specExpression) {
		var expr = specExpression;
		if(expr.search(/(open.?|åpen.?|laste.?)/gi)!=-1)
			return "ctx.driver.get(ctx.testUrl).then(function () {	ctx.driver.findElement(webdriver.By.tagName('body')); } " // Open a web page
		else if(expr.search(/(exist.?|finne.?)/gi)!=-1)
			return "ctx.assert.existsElement('Selector', 'Finnes')"; // Exists	
		else			
			return "ctx.assert.visibleElement('Selector', 'Vises')"; // Default
	}
	
	self.findStepVerb = function(scenarioStepText, previousVerb) {
		return self.findStartingVerb(scenarioStepText.substr(0,scenarioStepText.indexOf(' ')), previousVerb); // Clip off first word
	}
	
	self.findStepExpression = function(scenarioStepText) {
		return scenarioStepText.substr(scenarioStepText.indexOf(' ')+1);
	}
	
	self.makeScenarioSteps = function(scenarioSteps) {
		var stepCode = '';
		var previousVerb = '';
		for(var i=0;i<scenarioSteps.length;i++) {
			stepCode += '\n'+self.makeStepStub(scenarioSteps[i], previousVerb);
			previousVerb = self.findStepVerb(scenarioSteps[i], previousVerb);
		}
		return stepCode;
	}	
	
	self.makeFeatureHeading = function(feature) {
		return '/* FEATURE: {0}*/'.format(feature.title);
	}

	// Logging errors in MSBuild format: (origin) : (|subcategory) (error|warning) (code) : (text)
	// Example: cl : Command line warning D4024 : unrecognized source file type 'foo.cs', object file assumed
	self.makeVisualStudioErrorMessage = function(casperStepsModule, err) {

		function FindErrorFileReference(scenarioStepsFilePath, errorStackArray) {
			var dirNormalizer = new RegExp('\\+','gi');
			for(var i=0;i<errorStackArray.length;i++) { 
				if(errorStackArray[i].sourceURL == scenarioStepsFilePath.replace(dirNormalizer,'|'))
					return errorStackArray[i];
			}
			return { sourceURL: 'No matching file found in stack', line: -1 }; 
		}

		var errorFileRef = FindErrorFileReference(casperStepsModule, err.stackArray);
		return '{0}({1}): error CJS{2}: {3}\n'.format(errorFileRef.sourceURL, errorFileRef.line, err.sourceId, (err.name +' --> ' + err.message));		
	}
	
	return self;
};
