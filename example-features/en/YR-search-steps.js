var webdriver = require('selenium-webdriver');
var assert = require('selenium-webdriver/testing/assert');

exports.steps = {
	using: function(library, ctx) {
		library.define("I start yr2014 with $STED in the search field", function(sted) {
			ctx.driver.get('http://yr.cloudapp.net/nb/')
			.then(function() {
				ctx.driver.findElement(webdriver.By.id('searchInput')).sendKeys(sted);
				ctx.driver.findElement(webdriver.By.css('button[type="submit"]')).click();
				ctx.driver.findElement({ css: '#pageContent ol.list a[href*="'+sted+'"]' }).click();
			});
		});

		library.define("I should see the weather forecast for $STED", function(sted) {
			ctx.driver.findElement({ css: '#pageHeader div.title h1' })
			.getText().then(function(text) {
				assert(text).contains(sted);	
			});
		});
		
		library.define('I search for "$STED"', function(sted) {
			ctx.driver.get('http://yr.cloudapp.net/nb/')
			.then(function() {
				ctx.driver.findElement(webdriver.By.id('searchInput')).sendKeys(sted);
				ctx.driver.findElement(webdriver.By.css('button[type="submit"]')).click();				
			});
        });
		
		library.define('I want to see "$STED" in search results', function(sted){
			ctx.driver.findElement({ css: '#pageContent ol.list a[href*="'+sted+'"]' })
			.getText().then(function(text) {
				assert(text).contains(sted);	
			});
        });

		library.define('I want be able to select "$STED" from the search results', function(sted){
			ctx.driver.findElement({ css: '#pageContent ol.list a[href*="'+sted+'"]' }).click()
			.then(function() {
				ctx.driver.findElement({ css: '#pageHeader div.title h1' }).getText().then( function(text) {
					assert(text).contains(sted);	
				});
			});
        });
	}
};
