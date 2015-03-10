var webdriver = require('selenium-webdriver');
var assert = require('selenium-webdriver/testing/assert');
var should = require('should');

// NOTE: browserstack browsers need browser profiles with share location ON
exports.steps = {
	using: function (library, ctx) {

		// Helper method for updating coordinates in geolocation mock in ghostdriver; GIT\devops\utils\phantomjs\lib\ghostdriver\src\custom_injects\geolocationmock.js
		function _updateGeoLocationWaypoint(index, lat, lng) {
			return ctx.driver.executeScript('navigator.geolocation.waypoints['+index+'].coords.latitude='+lat+'; navigator.geolocation.waypoints['+index+'].coords.longitude='+lng+'; return navigator.geolocation.waypoints['+index+'].coords;');
		};
	
		library.når('jeg bruker posisjonen til søke etter steder i nærheten', function () {
			// DOES NOT WORK: ctx.custommockmodule.getAPI().locationsByQuery({lat: '10', lng: '10'}, {language: 'nb'});
			// INSTEAD USE: test injected location mock in phantomjs-ghostdriver, so remember to start phantomjs-webdriver with custom ghostdriver:
			// COMMAND LINE EXAMPLE: c:\git\devops\utils\phantomjs\lib\phantom\phantomjs.exe --webdriver=8001 --webdriver-ghostdriverpath=c:\git\devops\utils\phantomjs\lib\ghostdriver\ --webdriver-loglevel=SEVERE            
			
			ctx.assert.loadUrl(ctx.testUrl + 'nb')
			.then(function () {				
					ctx.driver.executeScript('return (navigator.geolocation!==undefined);').then(function(geolocationIsLoaded) {
					geolocationIsLoaded.should.equal(true, 'Geolocation mock er lastet');
				
					_updateGeoLocationWaypoint(0, 59.8, 10.150).then(function(mockCoord) { 
						console.log('Mocked coordinates: ' + JSON.stringify(mockCoord));
					});				

					ctx.driver.findElement(webdriver.By.css('button.geolocation-search')).then( function(geolocationButton) {
						should.exist(geolocationButton);
						geolocationButton.click();						
						
					});
				});
			});
		});
		
		library.så('får jeg opp et søkeresultat med liste over steder i nærheten', function () {
			var h3 = webdriver.By.tagName('h3');
			ctx.driver.isElementPresent(h3);

			ctx.driver.findElement(h3).getText()
			.then(function (text) {
				text.should.containEql('TREFF 5 STEDER I NÆRHETEN');
			});

			ctx.driver.findElement(webdriver.By.id('page'))
			.then(function (page) {
				page.findElements(webdriver.By.tagName('li'))
				.then(function (array) {
					array.length.should.eql(5);
				});
			});
		});
		
		library.og('når jeg klikker på det første stedet i listen', function () {
			ctx.driver.findElement(webdriver.By.css('ol.list a')).then( function(locationLink) {
				should.exist(locationLink);
				locationLink.click();						
			});
		}),
		
		library.så('skal jeg få opp en detaljside for stedet', function () {			
			ctx.driver.findElement(webdriver.By.css('.location-header__region')).getText().then( function(innerText) {	
				(innerText.length).should.be.above(0); // Should have some location name
			});			
		});
		
		library.og('og jeg skal se værmelding for dagen i dag og $ANTALLVARSEL dager fremover', function (antallvarsel) {
			ctx.driver.findElement(webdriver.By.css('h2.date-heading')).getText().then( function(dayHeading) {
				(dayHeading.length).should.be.above(0); // Should have some location name
				dayHeading.should.match(/(I dag|Today)/)
			});
			
			ctx.driver.findElements(webdriver.By.css('li.timeline__interval')).then( function(listForecasts) {
				listForecasts.length.should.be.within(parseInt(antallvarsel),parseInt(antallvarsel)+1)
			}); 
			
		});
	}
};
