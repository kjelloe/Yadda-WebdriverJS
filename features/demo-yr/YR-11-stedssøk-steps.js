var webdriver = require('selenium-webdriver')
	, should = require('should');

//Working on OSX but not on linux
exports.steps = {
	using: function (library, ctx) {
		library.når('jeg har skrevet inn et stedsnavn i søkefeltet og trykker på enter på tastaturet', function () {
			ctx.driver.get(ctx.testUrl + 'nb')
			.then(function () {
				var inputElement = ctx.driver.findElement(webdriver.By.id('freetextSearchInput'));
				inputElement.sendKeys('O');
				ctx.driver.findElement(webdriver.By.className('freetext-search')).submit();
			});
		});

		library.så('sendes jeg til en søkeresultatside', function () {
			var h3 = webdriver.By.tagName('h3');
			ctx.driver.wait(function () {
    		return ctx.driver.isElementPresent(h3);
			}, 5000);

			ctx.driver.findElement(h3).getText()
			.then(function (text) {
				text.should.containEql('TREFF 5 STEDER');
			});

			ctx.driver.findElement(webdriver.By.id('page'))
			.then(function (page) {
				page.findElements(webdriver.By.tagName('li'))
				.then(function (array) {
					array.length.should.eql(5);
				});
			});
		});
	}
};