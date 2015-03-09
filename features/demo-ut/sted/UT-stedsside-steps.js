var webdriver = require('selenium-webdriver')
	, should = require('should');
	
exports.steps = {
	using: function(library, ctx) {
		
		library.når("en bruker åpner en stedside", function() {
			// Lokasjon for NORSK RIKSKRINGKASTING
			ctx.driver.get(ctx.testUrl + 'sted/5.SSR73775')
			.then(function() {
				ctx.assert.elementWaitVisible('body');
			});
		});

		library.så("vises det en tittel ihht UT-4971", function() {
			ctx.assert.visibleElement('header.heading h1', 'Tittel finnes');
		})

		library.så("bruker ser fokuskart på hyttekjerneside ihht UT-5000", function() {
			  ctx.assert.visibleElement('section.map-container', 'Fokuskart vises');
			  ctx.assert.elementWaitVisible('#map-container .leaflet-container').then(function() {
				   ctx.assert.visibleElement('div.mapcaption', 'Forklarende tekst under kartet vises');
				   ctx.assert.elementContainsText('div.mapcaption', 'Lat/Lon');
			  });			  
		})

		library.så("bruker ser relaterte hytter i nærheten på stedkjernesiden ihht UT-5243", function() {
			ctx.assert.elementWaitVisible('#relatertehytter article').then(function() {
				ctx.assert.existsMoreElementsThan('#relatertehytter article a[href][title]', 0, 'Det finnes liste over relaterte hytter');
			});
		})

		library.så("bruker ser relaterte turer i nærheten på stedkjernesiden ihht UT-5251", function() {
			ctx.assert.elementWaitVisible('#relaterteturer article').then(function() {
				ctx.assert.existsMoreElementsThan('#relaterteturer article a[href][title]', 0, 'Det finnes liste over relaterte turer');
			});
		})
	}
};
