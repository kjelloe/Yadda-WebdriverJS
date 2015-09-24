var webdriver = require('selenium-webdriver')
  , should = require('should');

exports.steps = {
  using: function (library, ctx) {
    library.når('jeg skriver deler av et stedsnavn i søkefeltet, for eksempel "$STEDSNAVN", og trykker enter', function (stedsnavn) {
      ctx.driver.get(ctx.testUrl + 'nb') 
      .then(function () {
        var inputElement = ctx.driver.findElement(webdriver.By.id('freetextSearchInput'));
        inputElement.sendKeys(stedsnavn);
        ctx.driver.sleep(300); // NOTE: Added a slight wait to simulate human behaviour
        inputElement.getAttribute("value").then(function(inputText)  {
          if(stedsnavn!==inputText) {	throw new Error('Fant ikke stedsnavn som skulle vært skrevet inn i søkefeltet:"' + stedsnavn + '". I søkefeltet står istedet: "'+inputText+'"'); }
          // NOTE: Bruker av enter er istedenfor å bruke knappen: ctx.driver.findElement(webdriver.By.className('freetext-search')).submit();
          inputElement.sendKeys(webdriver.Key.ENTER); 
        })
      })
    })

    library.så('sendes jeg til en søkeresultatside som viser $ANTALL treff', function (antall) {
      // NOTE: Added robustness; Wait for search page to load
      ctx.assert.findElementWait('#page ol.list').then( function() { 
        ctx.assert.elementContainsText('#page h3', 'TREFF ' + antall + ' STEDER')
        ctx.assert.existsMoreElementsThan('#page ol.list a[href]', parseInt(antall)-1, 'Fant 20 steder eller mer i søkeresultat-listen')
      })
    })
  }
};
