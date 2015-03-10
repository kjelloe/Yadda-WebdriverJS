var webdriver = require('selenium-webdriver');

exports.steps = {
	using: function (library, ctx) {
		library.når('det er meldt ekstremvær', function () {
			ctx.custommockmodule.getAPI().extremeWarning(true);
			ctx.assert.loadUrl(ctx.custommockmodule.getMockServerUrl()+'nb')
			.then(function () {
				ctx.assert.existsElement('header.page-header');
			});
		});

		library.så('vises ekstremvarsel klart og tydelig for meg', function () {
			ctx.driver.findElement(webdriver.By.className('notification--extreme')).isDisplayed();
		});
	}
};
