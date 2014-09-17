// Setting up test assert helper
var webdriver = require('selenium-webdriver');
var assert = require('selenium-webdriver/testing/assert');

module.exports = {
	init: function (providedDriver) {
		var helper = {};
		helper.findElementTimeoutMs = 3000;
		helper.driver = providedDriver;		
		
		helper.elementContainsText = function(selectorExpr, textToFind) {
			helper.driver.wait(function() {
				helper.driver.findElement({ css: selectorExpr })
				.getText().then(function(text) {
					assert(text).contains(textToFind);	
				});
				return true;
			}, helper.findElementTimeoutMs);
		};
		
		helper.findElement = function(selectorExpr) {
			return helper.driver.findElement(webdriver.By.css(selectorExpr));
		};
		
		return helper;
	}	
};
