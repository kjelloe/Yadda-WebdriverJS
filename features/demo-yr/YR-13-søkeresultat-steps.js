var webdriver = require('selenium-webdriver')
  , should = require('should');
  
exports.steps = {
  using: function(library, ctx) {

    var selectedLocation = 'No place selected?'
  
    library.når("jeg søker på $STED og får opp søkeresultatsiden", function(sted) {
      selectedLocation = sted
      ctx.assert.loadUrl(ctx.testUrl + 'en/search?q='+sted)
      .then(function() {
        ctx.assert.elementWaitVisible('body')
      });
    })

    library.så("viser siden en liste med maksimalt $ANTALL mulige stedsnavn med tilhørende navn, kategori region og land", function(antall) {
      ctx.assert.elementContainsText('#page h3', antall + ' PLACES FOUND')
      ctx.assert.existsMoreElementsThan('#page ol.list a[href]', parseInt(antall)-1, 'Fant 20 steder eller mer i søkeresultat-listen')
      // Sjekk hvert sted i listen for å se om de har nødvendige elementer
      ctx.driver.findElements(webdriver.By.css('#page ol.list a.list__anchor')).then( function(listPlaces) {
        for(var i=0;i<listPlaces.length;i++) {
          var onePlace = listPlaces[i]
          ctx.assert.elementHasText('.list__name', onePlace)
          ctx.assert.elementHasText('.location-region', onePlace)
          ctx.assert.elementHasText('.list__category', onePlace)
        }
      });		
    })

    library.så("når jeg trykker på av stedene i listen kommer jeg til punktsiden til stedet", function() {
      ctx.driver.findElements(webdriver.By.css('#page ol.list a.list__anchor')).then( function(listPlaces) {
        var firstPlace = listPlaces[0]
        firstPlace.isDisplayed().then( function() {
          firstPlace.click()
          .then(function() {
            ctx.assert.elementWaitVisible('body')
            ctx.assert.elementContainsText('h1.location-header__title', selectedLocation)		
          });
        });				
      });
    })
  }
};
