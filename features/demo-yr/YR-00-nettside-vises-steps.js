var webdriver = require('selenium-webdriver');

exports.steps = {
  using: function (library, ctx) {
    library.define("LOCALE","(en|nb|nn|se|fkv)");
    library.når('jeg starter YR-2014 for første gang kommer det opp "$LOCALE" som språkvalg', function(locale) {
      ctx.driver.manage().deleteCookie('l'); // NOTE: Removing any previous language choice which is stored as a cookie
      ctx.assert.loadUrl(ctx.testUrl)
      .then(function () {
        ctx.assert.existsElement('#viewport');
        ctx.assert.visibleElement('#viewport nav a[href="/'+locale+'"]');
      });
    });

    library.så('jeg kan velge "$LOCALE" som språk', function(locale) {
      ctx.driver.findElement({ css: '#viewport nav a[href="/'+locale+'"]'}).click()
      .then(function () {
        ctx.assert.existsElement('#viewport');
        ctx.assert.visibleElement('div.home__intro');
      });
    });

    library.så('forsiden viser knapp for "$SETTINGS" der jeg kan bytte språk senere', function(settings) {
      ctx.assert.elementContainsText('.settings-container button', settings);
    });
  }
};
