// Setting up test assert helper
var webdriver = require('selenium-webdriver');
var assert = require('selenium-webdriver/testing/assert');
var should = require('should');

module.exports = {
	init: function (providedDriver) {
		var helper = {};
		helper.findElementTimeoutMs = 12000;
		helper.waitElementTimeoutMs = 60000;
		helper.driver = providedDriver;		
		helper.not = {}; // Container for negating functions
		
		helper.elementContainsText = function(selectorExpr, textToFind, optionalParentElement) {
			if(optionalParentElement===undefined) { optionalParentElement = helper.driver }
			helper.driver.wait(function() {
				optionalParentElement.findElement({ css: selectorExpr })
				.getText().then(function(text) {
					assert(text).contains(textToFind, 'Element "' + selectorExpr + '" contains "' + text + '"');
				});
				return true;
			}, helper.findElementTimeoutMs);
		};
		
		helper.elementHasText = function(selectorExpr, optionalParentElement) {
			if(optionalParentElement===undefined) { optionalParentElement = helper.driver }
			helper.driver.wait(function() {
				optionalParentElement.findElement({ css: selectorExpr })
				.getText().then(function(text) {
					text.length.should.be.greaterThan(0, 'Element "' + selectorExpr + '" contains some text');
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
		
		helper.findElementWait = function(selectorExpr) {
			var loadDone = webdriver.promise.defer();
			helper.driver.wait(function() {
				var elem = helper.driver.findElement({ css: selectorExpr });
				loadDone.fulfill(elem);
				return true;
			}, helper.findElementTimeoutMs);
			return loadDone.promise;
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
		
		helper.waitForElementsInContainer = function(containerExpr, elementsExpression, assertFunction) {
			helper.findElementWait(containerExpr).then(function (suggestionPanel) {
				helper.driver.wait(function() {
					var elemIsPresent = helper.driver.isElementPresent(webdriver.By.css(elementsExpression))
					.then( function() {
						if(assertFunction!==undefined) {
							helper.driver.findElements(webdriver.By.css(elementsExpression)).then( assertFunction );
						} else {
							helper.driver.findElements(webdriver.By.css(elementsExpression)).then( function(elementList) {
								elementList.length.should.be.greaterThan(0);
							});
						}
					});
					return true;
				}, helper.waitElementTimeoutMs);
			});
		};
		
		helper.existsMoreElementsThan = function(selectorExpr, moreThanCount, assertionMessage) {
			var done = webdriver.promise.defer();
			helper.driver.findElements(webdriver.By.css(selectorExpr)).then(function (list) {
				list.length.should.be.greaterThan(moreThanCount, (assertionMessage===undefined? 'List of elements not found using CSS selector: "'+selectorExpr+'"' : assertionMessage));
			});
			return done;
		};
		
		helper.existsLessElementsThan = function(selectorExpr, lessThanCount, assertionMessage) {
			var done = webdriver.promise.defer();
			helper.driver.findElements(webdriver.By.css(selectorExpr)).then(function (list) {
				list.length.should.be.lessThan(lessThanCount, (assertionMessage===undefined? 'List of elements not found using CSS selector: "'+selectorExpr+'"' : assertionMessage));
			});
			return done;
		};
		
		helper.existsExactElements = function(selectorExpr, count, assertionMessage) {
			var done = webdriver.promise.defer();
			helper.driver.findElements(webdriver.By.css(selectorExpr)).then(function (list) {
				list.length.should.equal(count, (assertionMessage===undefined? 'List of elements not found using CSS selector: "'+selectorExpr+'"' : assertionMessage));
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
					assert(tagname.toLowerCase()).equalTo('body', 'HTML page could not be loaded from url: "' + url + '"'); 
					loadDone.fulfill(true);
				});
			});
			return loadDone.promise;
		}
		
		return helper;
	}	
};
