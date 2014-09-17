var webdriver = require('selenium-webdriver');

exports.steps = {
	using: function(library, ctx) {
		library.når("jeg starter yr2014 med $STED i søkefeltet", function(sted) {
			ctx.driver.get(ctx.testUrl)
			.then(function() {
				ctx.driver.findElement({ css: '#searchInput'}).sendKeys(sted);
				ctx.driver.findElement({ css: 'button[type="submit"]'}).click();
				ctx.driver.findElement({ css: '#pageContent ol.list a[href*="'+sted+'"]' }).click();
			});
		});

		library.så("skal jeg se værmeldingen for $STED", function(sted) {
			ctx.assert.elementContainsText('#pageHeader div.title h1', sted);			
		});
		
		library.når('jeg søker etter stedet "$STED"', function(sted) {
			ctx.driver.get(ctx.testUrl)
			.then(function() {
				ctx.driver.findElement( { css: '#searchInput' } ).sendKeys(sted);
				ctx.driver.findElement( { css: 'button[type="submit"]' } ).click();				
			});
        });
		
		library.så('skal "$STED" vises i søkeresultat', function(sted){
			ctx.assert.elementContainsText('#pageContent ol.list a[href*="'+sted+'"]', sted);		
        });

		library.og('jeg skal kunne velge "$STED" fra søkelisten', function(sted){
			ctx.driver.findElement({ css: '#pageContent ol.list a[href*="'+sted+'"]' }).click()
			.then(function() {
				ctx.assert.elementContainsText('#pageHeader div.title h1', sted);		
			});
        });
	}
};
