var webdriver = require('selenium-webdriver')
	, should = require('should');
	
exports.steps = {
	using: function(library, ctx) {
		library.når("en bruker starter UT beta nettsidene", function() {
			ctx.driver.get(ctx.testUrl)
			.then(function() {
				ctx.assert.elementWaitVisible('div.developerbanner');
			});
		});
		
		library.så("skal $TEKST vises i overskriften", function(tekst) {			
			ctx.assert.elementContainsText('#container h1', tekst);
		});
		
		library.og("hovedmeny skal vises", function() {
			ctx.assert.existsElement('#container .main-menu','Hovedmeny vises');
		});

		library.så("meny med lenker vises", function() {
			ctx.assert.existsMoreElementsThan('nav .meny a[href]',0, 'Minst en klikkbar meny-lenke finnes');
		})

		library.så("siste oppdaterte turer vises ihht krav UT-6190", function() {
			ctx.assert.existsMoreElementsThan('#sisteturer article a[href][title]', 1, 'Det finnes liste over sist oppdaterte turforslag');
		})

		library.så("siste oppdaterte hytter vises ikkt krav UT-6184", function() {
			ctx.assert.existsMoreElementsThan('#sistehytter article a[href][title]', 1, 'Det finnes liste over sist oppdaterte hytter');
		})
		
		library.så("siste besøkte sider skal ikke vises hvis bruker ikke har besøkt siden før", function() {
			ctx.assert.not.existsElement('#sistbesokt');
		})
		
		library.så("artikkelhero skal vises", function() {
			ctx.assert.existsMoreElementsThan('.hovedsak article.hero a[href][title]', 0, 'Det finnes artikkelhero');
		})

		library.så("artikkelflyt skal vises", function() {
			ctx.assert.existsMoreElementsThan('#sisteartiklerkonteiner article a[href][title]', 1, 'Det finnes artikkelflyt');
		})

		library.så("søkefelt vises", function() {
			ctx.assert.existsElement('#hovedsok', 'Sokefelt finnes');
		})

		library.så("UT-logo vises", function() {
			ctx.assert.visibleElement('h1.utlogo', 'Ut-logo er synlig.');
		})

		library.så("det finnes en bunnmeny med lenker", function() {
			ctx.assert.existsMoreElementsThan('footer nav .meny a[href]', 0, 'Minst en klikkbar meny-lenke finnes');
		})

		library.så("det finnes partnerlogo for NRK og DNT i toppen", function() {
			ctx.assert.elementWaitVisible('nav .partners a.nrk img', 'NRK logo finnes');
			ctx.assert.elementWaitVisible('nav .partners a.dnt img', 'DNT logo finnes');
		})

		library.så("det finnes partnerlogo for NRK og DNT i bunnen", function() {
			ctx.assert.elementWaitVisible('footer .partners a.nrk img', 'NRK logo finnes');
			ctx.assert.elementWaitVisible('footer .partners a.dnt img', 'DNT logo finnes');
		})
	}
};
