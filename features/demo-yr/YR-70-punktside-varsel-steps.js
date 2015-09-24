var webdriver = require('selenium-webdriver')
  , should = require('should');
  
exports.steps = {
  using: function(library, ctx) {
    
    var antallVarslerSomSkalVises = -1;
    
    library.når("jeg laster punktsiden for et sted", function(sted) {
      ctx.assert.loadUrl(ctx.testUrl + 'nb/tabell/dag/1-73777/Norge/Oslo/Oslo/Torshov')
      .then(function() {
        ctx.assert.elementWaitVisible('body');
      });
    })

    library.så("skal jeg se varsel for i dag og de neste $ANTALLVARSEL dager", function(antallvarsel) {
      antallVarslerSomSkalVises = parseInt(antallvarsel);
      ctx.driver.findElements(webdriver.By.css('.timeline-interval--daily')).then( function(listForecasts) {
        listForecasts.length.should.be.within(antallVarslerSomSkalVises,(antallVarslerSomSkalVises+1))
      });			
    })
      
    library.og("varselet viser min-maks temperatur", function() {			
      ctx.driver.findElements(webdriver.By.css('.timeline--daily span.temp__value.temp__value--max')).then( function(listMaxTemp) {
        listMaxTemp.length.should.be.within(antallVarslerSomSkalVises,(antallVarslerSomSkalVises+1))
      });
      ctx.driver.findElements(webdriver.By.css('.timeline--daily span.temp__value.temp__value--min')).then( function(listMinTemp) {
        listMinTemp.length.should.be.within(antallVarslerSomSkalVises,(antallVarslerSomSkalVises+1))
      });
    })

    library.og("vindstyrke angitt i sekundmeter", function() {			
      ctx.driver.findElements(webdriver.By.css('figure.wind')).then( function(listWinds) {
        // TODO: Teste vind når den ikke forekommer i data? Når vi går mot prod-data kan vi ikke vite om vi har nok vind til at den vises på oppsummeringssiden
        for(var i=0;i<listWinds.length;i++) { // Check all wind texts found
          listWinds[i].getText().then(function(windText) { 
            windText.should.match(/[0-9]?[0-9] m\/s/g)
          });
        }
      });			
    })

    library.og("minst $MINSYMBOL og maksimalt $MAXSYMBOL værsymboler", function(minsymbol, maxsymbol) {
      ctx.driver.findElements(webdriver.By.css('.timeline-interval--daily')).then( function(listForecasts) {				
        for(var i=0;i<listForecasts.length;i++) {
          listForecasts[i].findElements(webdriver.By.css('figure.weather-table__symbol')).then( function(oneDaySymbols) {
            (oneDaySymbols.length).should.be.within(parseInt(minsymbol),parseInt(maxsymbol));
          }); 
        }
      });	
    })
  }
};
