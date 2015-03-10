var webdriver = require('selenium-webdriver')
	, should = require('should');

exports.steps = {
	using: function (library, ctx) {
		library.når('jeg er inne på en hvilken som helst YR-side', function () {
			ctx.assert.loadUrl(ctx.testUrl + 'nb');
		});

		library.så('skal jeg se logo og navn for NRK, Meterologisk instititutt og redaksjonelt ansvarlig.', function () {
			//NRK og MET logo
			ctx.driver.findElement(webdriver.By.className('page-footer__logos'))
			.then(function (footer) {
				footer.findElement(webdriver.By.className('logo-nrk'))
				.then(function (nrk) {
					nrk.getAttribute('href').then(function (text) { text.should.eql('http://www.nrk.no/'); });
				});
				footer.findElement(webdriver.By.className('logo-met'))
				.then(function (met) {
					met.getAttribute('href').then(function (text) { text.should.eql('http://www.met.no/'); });
				});
			});

			//Redaksjonelt ansvarlig
			ctx.driver.findElement(webdriver.By.tagName('footer'))
			.then(function (footer) {
				footer.getText()
				.then(function (text) {
					text.should.containEql('Redaktør');
					text.should.containEql('Ansvarlig redaktør');
					text.should.containEql('Meteorologisk ansvarlig');
				})
			})
		});
	}
};