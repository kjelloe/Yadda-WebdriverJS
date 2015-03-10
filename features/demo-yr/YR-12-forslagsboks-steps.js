var webdriver = require('selenium-webdriver')
	, assert = require('selenium-webdriver/testing/assert');

exports.steps = {
	using: function (library, ctx) {
		library.når('jeg i et søkefelt skriver inn stedsnavn', function () {
			ctx.assert.loadUrl(ctx.testUrl + 'nb')
			.then(function () {
				ctx.driver.findElement(webdriver.By.id('freetextSearchInput')).then(function(input) {
					input.sendKeys('O');
				});
			});
		});

		library.så('skal jeg få frem en forslagsboks med forslag til stedsnavn etterhvert som jeg skriver slik at jeg kan gå direkte til et sted. ', function () {
			ctx.driver.findElement(webdriver.By.id('suggestionPanel')).isDisplayed()
			.then(function () {
				ctx.driver.findElement(webdriver.By.id('suggestionPanel')).then(function (suggestionPanel) {
					suggestionPanel.findElements(webdriver.By.tagName('li')).then(function (array) {
						assert(array.length).equalTo(5);
					});
				});
			});
		});
	}
};