var webdriver = require('selenium-webdriver')
	, should = require('should');
	
exports.steps = {
	using: function(library, ctx) {
		
		library.når("bruker åpner hyttesiden", function() {
			ctx.driver.get(ctx.testUrl + 'hytte/fake')
			.then(function() {
				ctx.assert.elementWaitVisible('body');
			});
		});
		
		library.så("finnes det et felt som sier når informasjonen ble siste oppdatert ihht krav $kravId", function(kravId) {
			ctx.assert.elementWaitVisible('div.date time');
			ctx.helper.findElement('div.date > time').getText().then(function (dateText) {
				// Merk: regex uttrykk for validering av datoformat, [- /.] tillater både - og . som dato-separator
				dateText.should.match(/^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/i, kravId+': Dato er på forventet format: YYYY.MM.dd');
			});
		});
		
		library.og("bruker ser tittel på hyttekjernesiden ihht krav $kravId", function(kravId) {			
			ctx.assert.visibleElement('header.heading h1', kravId+': Tittel finnes');
		});
		
		library.og("bruker ser høyde over havet på hyttekjernesiden ihht krav $kravId", function(kravId) {			
			ctx.assert.visibleElement('div.mapcaption[data-hoydeoverhavet]', kravId+': Bruker ser hoyde over havet pa hyttekjernesiden');
		});

		library.så("bruker ser bildegalleri på hyttekjernesiden ihht krav $kravId", function(kravId) {
			ctx.assert.visibleElement('section.gallery', 'Bildegalleri finnes');
			ctx.assert.existsElements('section.gallery figure.image img', 5, kravId +': Bruker ser bildegalleri med 5 bilder');
		})

		library.så("bruker ser fokuskart på hyttekjerneside ihht krav $kravId", function(kravId) {
			ctx.assert.visibleElement('section.map-container', kravId+': Fokuskart finnes');
		})

		library.så("bruker ser type på hyttekjernesiden ihht krav $kravId", function(kravId) {
			ctx.assert.visibleElement('div.facts td[data-type]', kravId+': Hytte-type finnes');
		})

		library.så("bruker ser betjeningsgrad på hyttekjernesiden ihht krav $kravId", function(kravId) {
			ctx.assert.visibleElement('div.facts td[data-type][data-betjeningsgrad]', kravId + ':Hytte-type med betjeningsgrad finnes');
		})

		library.så("bruker ser brødtekst på hyttekjernesiden ihht krav $kravId", function(kravId) {
			ctx.helper.findElement('.beskrivelse').getText().then( function(text) {
				text.length.should.be.greaterThan(10, kravId +': Bruker ser brødtekst på hyttekjernesiden');
			});
		});
		
		library.så("bruker ser fasiliteter på hyttekjernesiden ihht krav $kravId", function(kravId) {			
			ctx.helper.driver.isElementPresent(webdriver.By.css('div.facilities')).then(function(elem) {
				if(elem) { // Hvis hytten har fasiliteter i det hele tatt
					ctx.assert.existsMoreElementsThan('div.facilities li .facility', 1, kravId +': Hytten har minst en fasilitet');
				}
			});
		})

		library.så("bruker ser relaterte turer i nærheten på hyttekjernesiden ihht krav UT-5051", function() {
			ctx.assert.existsMoreElementsThan('#relaterteturer article a[href][title]', 1, 'Det finnes liste over relaterte turer');			
		})

		library.så("bruker ser relaterte hytter i nærheten på hyttekjerneside ihht krav UT-5058", function() {
			ctx.assert.existsMoreElementsThan('#relatertehytter article a[href][title]', 1, 'Det finnes liste over relaterte hytter');
		})

		library.så("bruker ser relaterte steder i nærheten på hyttekjerneside ihht krav UT-5283", function() {
			console.log('NOT IMPLEMENTED: relaterte steder');  // TODO: Implement step, i.e: ctx.assert.visibleElement('Selector', 'Vises');
		})

		library.så("bruker ser kontaktinformasjon på hyttekjernesiden ihht krav UT-5016", function() {
			ctx.assert.existsElement('.kontaktinfo [data-sesong="1"][data-type="kontaktinfo"]', 'Det vises kontaktinfo for perioden i sesong');
			ctx.assert.existsMoreElementsThan('.kontaktinfo [data-sesong="1"]~[data-type]', 2, 'Det finnes en liste med minst ett kontaktdatafelt');
			
			ctx.assert.existsElement('.kontaktinfo [data-sesong="0"][data-type="kontaktinfo"]', 'Det vises kontaktinfo for perioden utenfor sesong');
			ctx.assert.existsMoreElementsThan('.kontaktinfo [data-sesong="0"]~[data-type]', 2, 'Det finnes en liste med minst ett kontaktdatafelt');
		})

		library.så("bruker ser åpningstider på hyttekjernesiden ihht krav UT-5001", function() {
			ctx.assert.visibleElement('.seasonopenings [data-fromdate]','Det vises åpningstider for hytte')
			ctx.assert.visibleElement('.seasonopenings [data-todate]','Det vises lukketider for hytte');
		})

		library.så("bruker ser adkomst på hyttekjernesiden ihht krav UT-5023", function() {			
			ctx.assert.visibleElement('aside.arival', 'Det vises en adkomst-seksjon');
			ctx.assert.visibleElement('aside.arival h2', 'Det vises en adkomst for sommer og/eller vinter');
			ctx.assert.textLengthGreaterThan('.arival > div', 10, 'Det vises en adkomst-beskrivelse');					
		})

		library.så("bruker ser nettkamera på hyttekjernesiden ihht krav UT-5044", function() {
			ctx.assert.visibleElement('section.webcams', 'Det vises en webkamera-seksjon');			
			ctx.assert.existsMoreElementsThan('section.webcams .webcam img[alt][src]', 1, 'Det finnes en liste med minst ett webkamera');
		})

		library.så("bruker ser kartblad på hyttekjernesiden ihht krav UT-5037", function() {
			ctx.assert.visibleElement('aside.papermap', 'Det vises en kartblad-seksjon');
			ctx.assert.textLengthGreaterThan('aside.papermap > p', 10, 'Det vises en kartblad-referanse i tekst');			
		})

		library.så("bruker ser overnattingsmuligheter på hyttekjerneside ihht krav UT-5065", function() {
			ctx.assert.visibleElement('div.facts td[data-sengeplasser]', 'Det finnes informasjon om overnattingsmuligheter. ');
			ctx.helper.findElement('div.facts td[data-sengeplasser]','data-sengeplasser').getAttribute('data-sengeplasser').then( function(sengeplassData) {
				sengeplassData.should.match(/^(\d+)(,\s*\d+)*$/, 'Underlag for sengeplass-visning finnes:' + sengeplassData);
			}); 
		})

		library.så("bruker ser facebook-url på hyttekjerneside ihht krav UT-5184", function() {
			ctx.assert.visibleElement('aside.kontaktlenker div.lenke a[href][data-linktype="facebook"]', 'Det finnes lenke til facebook-side.');
		})
	}
};
