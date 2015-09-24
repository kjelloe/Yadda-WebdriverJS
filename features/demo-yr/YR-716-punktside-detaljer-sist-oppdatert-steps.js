var webdriver = require('selenium-webdriver')
  , should = require('should');
  
exports.steps = {
  using: function(library, ctx) {

    library.når("jeg åpner en punktside for sted", function() {
      ctx.assert.loadUrl(ctx.testUrl + 'nb/tabell/dag/1-73777/Norge/Oslo/Oslo/Torshov')
      .then(function() {
        ctx.assert.elementWaitVisible('body');
      });
    })

    library.så("ser jeg tidspunktet for siste oppdatering", function() {
      ctx.assert.visibleElement('#page .timestamp__time', 'Tidspunkt for oppdatering vises');			
    })

    library.så("tidspunktet for neste oppdatering", function() {
      ctx.driver.findElement(webdriver.By.css('#page .timestamp__time')).getText().then( function(timestampText) {
        (timestampText.length).should.be.above(0); // Should have some text length
        timestampText.should.match(/Sist oppdatert kl ([01]?[0-9]|2[0-3]):[0-5][0-9] \| Ny oppdatering kl ([01]?[0-9]|2[0-3]):[0-5][0-9]/g)
      });
    })
  }
};
