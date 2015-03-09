var webdriver = require('selenium-webdriver')
	, should = require('should');

exports.steps = {
	using: function(library, ctx) {
		library.når("jeg starter yr2014 med $STED i søkefeltet", function(sted) {
			ctx.driver.get(ctx.testUrl + 'nb')
			.then(function() {
				ctx.driver.findElement(webdriver.By.id('freetextSearchInput')).sendKeys(sted);
				ctx.assert.elementWaitVisible('#suggestionPanel ol').then( function() {
					ctx.driver.findElement(webdriver.By.css('ol.list a[href*="'+sted+'"]')).click();
				});				
			});
		});

		library.så("skal jeg se værmeldingen for $STED", function(sted) {
			ctx.driver.findElement(webdriver.By.css('.location-header__title')).getText().then( function(innerText) {
				innerText.should.containEql(sted);
			});
		});
	}
};
