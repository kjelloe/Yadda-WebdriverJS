var webdriver = require('selenium-webdriver')
	, should = require('should');
	
exports.steps = {
	using: function(library, ctx) {
			
		library.når("en bruker åpner en turside", function() {
			ctx.driver.get(ctx.testUrl + 'tur/fake')
			.then(function() {
				ctx.assert.elementWaitVisible('body');
			});
		})

		library.så("vises det en tittel", function() {
			ctx.assert.visibleElement('header.heading h1', 'Tittel finnes');
		})

		library.så("bruker ser relaterte hytter i nærheten på tursiden", function() {
			ctx.assert.elementWaitVisible('#relatertehytter article').then(function() {
				ctx.assert.existsMoreElementsThan('#relatertehytter article a[href][title]', 0, 'Det finnes liste over relaterte hytter');
			});
		})

		library.så("bruker ser relaterte turer i nærheten på tursiden", function() {
			ctx.assert.elementWaitVisible('#relaterteturer article').then(function() {
				ctx.assert.existsMoreElementsThan('#relaterteturer article a[href][title]', 0, 'Det finnes liste over relaterte turer');
			});
		})

		library.så("bruker ser relaterte artikler i nærheten på tursiden", function() {
			ctx.assert.elementWaitVisible('#relaterteartikler article').then(function() {
				ctx.assert.existsMoreElementsThan('#relaterteartikler article a[href][title]', 0, 'Det finnes liste over relaterte artikler');
			});
		})
	}
};
