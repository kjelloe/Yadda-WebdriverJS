var webdriver = require('selenium-webdriver')
	, should = require('should');
	
exports.steps = {
	using: function(library, ctx) {
			
		library.når("en bruker besøker UT beta nettsidene", function() {
			ctx.driver.get(ctx.testUrl)
			.then(function() {
				ctx.driver.manage().window().setSize(1000, 800); // WORKAROUND: Redrawing window to allow for loading of all elements before testing
				ctx.assert.elementWaitVisible('body');
			});
		})
	
		library.så("vises et søkefelt ihht UT-5353", function() {
			ctx.assert.visibleElement('div.sok input[type="text"]', 'Sokefelt finnes');
		})

		library.når("en bruker søker på hytte ", function() {
			ctx.driver.findElement(webdriver.By.id('hovedsok')).sendKeys('Gjen');
		});

		library.så("vises en søkeresultatside med treff på hytte ihht UT-5356", function() {
			ctx.assert.elementWaitVisible('div.autocomplete').then(function() {
				ctx.assert.existsMoreElementsThan('div.autocomplete li.element[data-type="hytte"]', 0, 'AC-treff funnet for hytte');
			});
		})

		library.så("de vises ikke mer enn $COUNT treff i listen ihht UT-5624", function(count) {
			ctx.assert.elementWaitVisible('div.autocomplete').then(function() {
				ctx.assert.existsLessElementsThan('div.autocomplete li.element', count, 'Antall i AC listen var som forventet: ' + count);
			});
		})

		library.når("en bruker søker på tur ", function() {
			ctx.driver.findElement(webdriver.By.id('hovedsok')).sendKeys('d');
		})

		library.så("vises en søkeresultatside med treff på tur ihht UT-5357", function() {
			ctx.assert.elementWaitVisible('div.autocomplete').then(function() {
				ctx.assert.existsMoreElementsThan('div.autocomplete li.element[data-type="tur"]', 0, 'AC-treff funnet for tur');
			});
		})

		library.så("bruker kan navigere i søkeresultatene i piltastene ihht UT-5634", function() {
			// Perform a search
			ctx.driver.findElement(webdriver.By.id('hovedsok')).sendKeys('Gjen');
			// Wait for the ac list to appear
			ctx.assert.findElementWait('div.autocomplete').then( function(listAutocomplete) {
				listAutocomplete.findElements(webdriver.By.css('li a div')).then(function (listResultItems) {
					// Check that we have results 
					listResultItems.length.should.be.greaterThan(0, 'AC-listen har treff');
					// Find text for first element to identify it later
					listResultItems[0].getText().then( function(firstElementText) {
						// Then press down button and check that the item selected by key down is the same as the first in the list,
						ctx.driver.findElement(webdriver.By.id('hovedsok')).sendKeys(webdriver.Key.ARROW_DOWN);
						ctx.assert.findElementWait('div.autocomplete li.aktiv').then( function(firstKeyText) {	
							ctx.assert.elementContainsText('div.autocomplete li.aktiv', firstElementText);
							// Then press down again and assert that the item selected by key down is NOT the same as the first element in the ac list anymore
							ctx.driver.findElement(webdriver.By.id('hovedsok')).sendKeys(webdriver.Key.ARROW_DOWN);							
							ctx.driver.findElement(webdriver.By.css('div.autocomplete li.aktiv')).getText().then( function(secondKeyText) {	
								firstElementText.should.not.equal(secondKeyText);
							});
						});
					});
				});
			});
		})
	}
};
