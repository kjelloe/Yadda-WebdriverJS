// Setting up test assert helper
var webdriver = require('selenium-webdriver');
var assert = require('selenium-webdriver/testing/assert');

module.exports = {
	init: function (providedDriver) {
		var helper = {};
		helper.findElementTimeoutMs = 6000;
		helper.driver = providedDriver;		
		helper.not = {}; // Container for negating functions
		
		helper.elementContainsText = function(selectorExpr, textToFind) {
			helper.driver.wait(function() {
				helper.driver.findElement({ css: selectorExpr })
				.getText().then(function(text) {
					assert(text).contains(textToFind);	
				});
				return true;
			}, helper.findElementTimeoutMs);
		};
		
		helper.elementWaitVisible = function(selectorExpr) {
			var loadDone = webdriver.promise.defer();
			helper.driver.wait(function() {
				var elem = helper.driver.findElement({ css: selectorExpr });
				loadDone.fulfill(elem.isDisplayed());
				return true;
			}, helper.findElementTimeoutMs);
			return loadDone.promise;
		};
		
		// Calls the provided function and returns the answer as a promise
		helper.elementExpressionWait = function(exprToCall, arg1, arg2, arg3) {
			var exprDone = webdriver.promise.defer();
			helper.driver.wait(function() {
				exprDone.fulfill(exprToCall.apply(helper, arg1, arg2, arg3));
				return true;
			}, helper.findElementTimeoutMs);
			return exprDone.promise;
		};
		
		helper.findElement = function(selectorExpr) {
			return helper.driver.findElement(webdriver.By.css(selectorExpr));
		};

		helper.existsElement = function(selectorExpr, assertionMessage) {
			var done = webdriver.promise.defer();
			helper.driver.isElementPresent(webdriver.By.css(selectorExpr)).then(function(result) {
				assert(result).isTrue(true, (assertionMessage===undefined? 'Element not found using CSS selector: "'+selectorExpr+'"' : assertionMessage));
			});
			return done;
		};
		
		helper.not.existsElement = function(selectorExpr, assertionMessage) {
			var done = webdriver.promise.defer();
			helper.driver.isElementPresent(webdriver.By.css(selectorExpr)).then(function(result) {
				assert(result).isFalse(assertionMessage===undefined? 'Element not found using CSS selector: "'+selectorExpr+'"' : assertionMessage);
			});
			return done;
		};

		helper.existsElements = function(selectorExpr, numElementsRequired, assertionMessage) {
			var done = webdriver.promise.defer();
			helper.driver.findElements(webdriver.By.css(selectorExpr)).then(function (list) {
				list.length.should.equal(numElementsRequired, (assertionMessage===undefined? 'List of elements not found using CSS selector: "'+selectorExpr+'"' : assertionMessage));
			});
			return done;
		};

		helper.existsMoreElementsThan = function(selectorExpr, moreThanCount, assertionMessage) {
			var done = webdriver.promise.defer();
			helper.driver.findElements(webdriver.By.css(selectorExpr)).then(function (list) {
				list.length.should.be.greaterThan(moreThanCount, (assertionMessage===undefined? 'List of elements not found using CSS selector: "'+selectorExpr+'"' : assertionMessage));
			});
			return done;
		};
		
		helper.visibleElement = function(selectorExpr, assertionMessage) {
			var result = helper.driver.findElement(webdriver.By.css(selectorExpr)).isDisplayed();
			assert(result).isTrue(true, (assertionMessage===undefined? 'Element not found using CSS selector: "'+selectorExpr+'"' : assertionMessage));
		};
		
		helper.textLengthGreaterThan = function(selectorExpr, lengthGreaterThan, assertionMessage) {
			helper.findElement(selectorExpr).getText().then( function(text) {
				text.length.should.be.greaterThan(lengthGreaterThan, (assertionMessage===undefined? 'Element not found using CSS selector: "'+selectorExpr+'"' : assertionMessage));
			});		
		}
		
		helper.loadUrl = function(url) {
			var loadDone = webdriver.promise.defer();
			helper.driver.get(url).then( function(page) {
				// NOTE: Phantomjs delivers 'html body' even on a page that does not exist; "no connection page"
				helper.driver.findElement(webdriver.By.tagName('body')).getTagName().then(function(tagname) {
					assert(tagname).equalTo('body', 'HTML page could not be loaded from url: "' + url + '"'); 
					loadDone.fulfill(true);
				});
			});
			return loadDone.promise;
		}
		
		return helper;
	}	
};
