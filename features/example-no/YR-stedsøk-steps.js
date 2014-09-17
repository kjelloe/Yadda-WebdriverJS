var webdriver = require('selenium-webdriver');
var assert = require('selenium-webdriver/testing/assert');

exports.steps = {
	using: function(library, ctx) {
		library.når("jeg starter yr2014 med $STED i søkefeltet", function(sted) {
			ctx.driver.get('http://yr.cloudapp.net/nb/')
			.then(function() {
				ctx.driver.findElement(webdriver.By.id('searchInput')).sendKeys(sted);
				ctx.driver.findElement(webdriver.By.css('button[type="submit"]')).click();
				ctx.driver.findElement({ css: '#pageContent ol.list a[href*="'+sted+'"]' }).click();
			});
		});

		library.så("skal jeg se værmeldingen for $STED", function(sted) {
			ctx.driver.findElement({ css: '#pageHeader div.title h1' })
			.getText().then(function(text) {
				assert(text).contains(sted);	
			});
		});
		
		library.når('jeg søker etter stedet "$STED"', function(sted) {
			ctx.driver.get('http://yr.cloudapp.net/nb/')
			.then(function() {
				ctx.driver.findElement(webdriver.By.id('searchInput')).sendKeys(sted);
				ctx.driver.findElement(webdriver.By.css('button[type="submit"]')).click();				
			});
        });
		
		library.så('skal "$STED" vises i søkeresultat', function(sted){
			ctx.driver.findElement({ css: '#pageContent ol.list a[href*="'+sted+'"]' })
			.getText().then(function(text) {
				assert(text).contains(sted);	
			});
        });

		library.så('jeg skal kunne velge "$STED" fra søkelisten', function(sted){
			ctx.driver.findElement({ css: '#pageContent ol.list a[href*="'+sted+'"]' }).click()
			.then(function() {
				ctx.driver.findElement({ css: '#pageHeader div.title h1' }).getText().then( function(text) {
					assert(text).contains(sted);	
				});
			});
        });
	}
};
