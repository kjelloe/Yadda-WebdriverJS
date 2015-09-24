var webdriver = require('selenium-webdriver')
  , should = require('should');
  
String.prototype.trim = function() {
  return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};
  
exports.steps = {
  using: function(library, ctx) {
      
    // Initial helper methods
    function _visitPlace(someLocation) {
      var visitDone = webdriver.promise.defer();
      // Now enter location in search box // OBSOLETE: ctx.assert.loadUrl(ctx.testUrl + 'nb/s%C3%B8k?q='+someLocation)
      // WORKAROUND: Use ctx assert loadurl  until whitelisting works for both stage and prod urls
      // var inputElement = ctx.driver.findElement(webdriver.By.id('freetextSearchInput'));
      // inputElement.sendKeys(someLocation)
      // inputElement.sendKeys(webdriver.Key.ENTER)
      ctx.assert.loadUrl(ctx.testUrl + 'nb/s%C3%B8k?q='+someLocation)
      .then(function() {
        ctx.assert.findElementWait('#page a.list__anchor:first-child').then( function(somePlace) {
          somePlace.click().then(function() {
            ctx.assert.elementWaitVisible('body')
            ctx.assert.elementContainsText('h1.location-header__title', someLocation)
            visitDone.fulfill(somePlace)
            return true
          });
        });				
      });
      return visitDone.promise
    }
      
    library.gitt("at jeg ikke har markert noe sted som favoritt, vises ingen liste over mine favoritter,", function() {			
      ctx.assert.loadUrl(ctx.testUrl + 'nb').then(function() { // Loading page
        ctx.driver.executeScript("javascript:localStorage.clear();").then(function() { // Clear local storage to remove all favourites
          ctx.assert.loadUrl(ctx.testUrl + 'nb').then(function() { // Reload page
            ctx.assert.not.existsElement('#page .home__locations', 'Ingen favorittliste vises'); 
          })
        })
      })
    })

    library.så("hvis jeg deretter søker opp et sted, for eksempel $STED, går til punktsiden og markerer stedet som favoritt,", function(sted) {
      _visitPlace(sted.trim()).then(function() {
        var favButton = ctx.driver.findElement(webdriver.By.css('#page .location-header button.location-favourite__button'))
        favButton.click()
        .then(function() {					
          ctx.driver.sleep(3000); // Vente 3 sek før vi avslutter pga lagring til local storage
        })
      })
    })

    library.så("skal jeg ved neste besøk til forsiden få opp samme sted $STED i favoritt-listen på forsiden", function(sted) {
      ctx.assert.loadUrl(ctx.testUrl + 'nb').then(function() { // Reload start page
        ctx.assert.existsElement('#page .home__locations', 'Favorittliste vises')
        ctx.driver.findElement(webdriver.By.css('#page .home__locations .location-favourite:first-child')).getText().then( function(favPlace) {
          sted.trim().should.equal(favPlace, 'Favorittsted på forsiden er det samme som ble markert på punktside')
        })
      })
    })
  }
};
