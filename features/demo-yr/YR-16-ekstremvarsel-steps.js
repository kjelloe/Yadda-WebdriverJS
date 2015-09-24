var webdriver = require('selenium-webdriver')
     , should = require('should');

exports.steps = {
  using: function (library, ctx) {

    library.når('det er meldt ekstremvær', function () {
        ctx.custommockmodule.getExtremeWeather().length.should.be.greaterThan(0);
    });

    library.og('jeg går inn på en hvilken som helst side', function () {
        ctx.assert.loadUrl(ctx.testUrl + 'nb', true)
        .then(function () {
            ctx.assert.existsElement('header.page-header');
        });
    });

    library.så('vises ekstremvarsel klart og tydelig for meg', function () {
        ctx.driver.findElement(webdriver.By.className('notification--extreme')).isDisplayed();
    });

    library.og('hvis jeg trykker på ekstremvarselet "$EXTREMENAME" får jeg opp en detaljvisning', function (extremeName) {
        ctx.driver.findElement(webdriver.By.css(".notification--extreme a[href*='"+extremeName.toLowerCase()+"']")).then(function (linkExtreme) {
            linkExtreme.click( function() {
                ctx.driver.sleep(500); // Wait to allow for loading
                ctx.assert.elementWaitVisible('header.extreme--header')
                ctx.assert.elementContainsText('.extreme--header__title', extremeName)
            });
        });
    });
  }
};
