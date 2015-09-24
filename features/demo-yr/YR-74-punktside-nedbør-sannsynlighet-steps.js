var webdriver = require('selenium-webdriver')
  , should = require('should');

exports.steps = {
	using: function(library, ctx) {

		ctx.driver.manage().window().setSize(800,600); // NOTE: Setting window size to be able to manipulate all forecasts in width as well
		var fakeWeatherApi =  ctx.custommockmodule; // Allows for manipulating fakedata/testdata in test context. Page needs to be reloaded pr change though.
		var testLocationUrl = ctx.testUrl + 'nb/tabell/time/1-72837/Norge/Oslo/Oslo/Oslo' // TOOD: Add configuration
	
		library.når("jeg går inn på punktsiden for et sted", function() {
			ctx.assert.loadUrl(testLocationUrl, true) // Using forcedrefresh to ensure that testdata is loaded
		})

		library.gitt("at det ikke er meldt nedbør", function() {
			fakeWeatherApi.setPrecipitationMm(0);
			fakeWeatherApi.setChanceOfRainPercentage(0)
		})

		library.gitt("at det er mulig det kommer nedbør", function() {
			fakeWeatherApi.setPrecipitationMm(5);
			fakeWeatherApi.setChanceOfRainPercentage(40)
		})

		library.gitt("at det ikke er meldt nedbør og sannsynligheten for regn er større enn 9%", function() {
			fakeWeatherApi.setPrecipitationMm(0)
			fakeWeatherApi.setChanceOfRainPercentage(80)
		})

		library.gitt("at det ikke er meldt nedbør og sannsynligheten for regn er mindre enn 10%", function() {
			fakeWeatherApi.setPrecipitationMm(0)
			fakeWeatherApi.setChanceOfRainPercentage(5)
		})

		library.når("ser på varselet for dag 1-3", function() {
			ctx.currentForecastDay = 1
		})

		library.når("ser på varselet for dag 4-10", function() {
			ctx.currentForecastDay = 5
		})

		library.så("skal jeg se teksten \"$INTETREGNTEKST\"", function(intetRegnTekst) {
			_findForecastDetails(parseInt(ctx.currentForecastDay),' .weather-table__row-heading--precipitation').then(function(precipList) {
				precipList.forEach(function(precipObject) {
					ctx.helper.getAttribute(precipObject, 'innertext').then(function(text) {
						text.should.equal(intetRegnTekst)
					})
				})
			})
		})

		library.så("skal jeg se sannsynligheten for at det skal regne", function() {
			_findForecastDetails(parseInt(ctx.currentForecastDay),'.precipProbability').then(function(precipList) {
				precipList.length.should.be.greaterThan(0)
				precipList.forEach(function(precipObject) {
					ctx.helper.getAttribute(precipObject, 'innertext').then(function(probText) {
						var expectedProb = fakeWeatherApi.getChanceOfRainPercentage()
						// DEBUG: console.log('DEBUG: ('+ctx.currentForecastDay+') expected probability: ' + expectedProb + ' VS actual: ' + probText )
						expectedProb.should.equal(probText) // Compare with actual inputted test data
					})
				})
			})
		})

		library.og("jeg skal se forventet nedbørsmengde", function() {
			_findForecastDetails(parseInt(ctx.currentForecastDay),'.precip--rain').then(function(precipList) {
				precipList.length.should.be.greaterThan(0)
				precipList.forEach(function(precipObject) {
					ctx.helper.getAttribute(precipObject, 'innertext').then(function(precipNum) {
						var expectedPrecip = fakeWeatherApi.getPrecipitationMm()
						// DEBUG: console.log('DEBUG: ('+ctx.currentForecastDay+') expected precip.: ' + expectedPrecip + ' VS actual: ' + precipNum)
						parseInt(precipNum).should.equal(expectedPrecip) // Compare with actual inputted test data
					})
				})
			})
		})
		
		// ------------------ Helper methods ----------------------------------------------------
		// Find and click on the forecast for the specified day, then fetch requested dom objects
		function _findForecastDetails(dayNumber, subExpression) {
			var findDayIndex = parseInt(dayNumber)-1
			var findDone = webdriver.promise.defer()
			ctx.driver.findElements(webdriver.By.css('#page .timeline-interval--daily a')).then(function (forecastDetails) {
				if(dayNumber<1 || dayNumber>forecastDetails.length) throw new Error('Invalid day specified. Use dayNumber 1 through ' + forecastDetails.length)
				var forecastDetail = forecastDetails[findDayIndex];
				forecastDetail.click().then(function() {				
					ctx.driver.sleep(500); // Wait to allow for loading
					ctx.assert.elementWaitVisible('.timeline-interval--hourly')
					ctx.driver.findElements(webdriver.By.css('.timeline-interval--hourly '+ subExpression)).then(function (listData) {
						if(listData.length==0) { throw new Error('Could not find forecast details using expression: ' + '.timeline-interval--hourly '+ subExpression) }
						findDone.fulfill(listData);
						return true;
					});
				});
			});
			return findDone.promise
		};
	}
};
