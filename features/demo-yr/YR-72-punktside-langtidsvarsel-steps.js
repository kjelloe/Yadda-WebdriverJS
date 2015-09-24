var webdriver = require('selenium-webdriver')
  , should = require('should');

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
            visitDone.fulfill(somePlace);
            return true
          });
        });
      });
      return visitDone.promise
    }

    function _getListOfAttributes(elements, attributeName, removeEmpty) {
      var listDone = webdriver.promise.defer();
      var listResults = new Array();
      var itemsProcessed = 0;

      elements.forEach(function(elem) {
        _getAttributeSync(elem, attributeName).then( function(result) {
          if(_isValueEmpty(result)==false || removeEmpty==false) { listResults.push(result) }
          itemsProcessed++
          if(itemsProcessed==elements.length) {
            listDone.fulfill(listResults);
            return true;
          }
        });
      });

      return listDone.promise;
    }

    function _isValueEmpty(someValue) {
      return !someValue;
    }

    function _getAttributeSync(element, attributeName) {
      var elemDone = webdriver.promise.defer();
      element.getAttribute(attributeName).then(function(attribValue) {
        // WORKAROUND: For safari etc which do not support innerText
        if(attributeName.toLowerCase()==='innertext' && attribValue==null) {
          _getTextContent(element).then( function(textValue) {
            elemDone.fulfill(textValue);
            return true;
          });
        }
        else { // Default; for all other browsers
          elemDone.fulfill(attribValue);
          return true;
        }
      });
      return elemDone.promise
    }

    function _getTextContent(element) {
      var elemDone = webdriver.promise.defer();
      element.getAttribute('textContent').then(function(attribValue) {
        elemDone.fulfill(attribValue);
        return true;
      });
      return elemDone.promise
    }

    library.gitt("at jeg henter opp punktsiden for et sted, for eksempel $STED", function(sted) {
      ctx.assert.loadUrl(ctx.testUrl + 'nb').then(function() {
        _visitPlace(sted)
      });
    })

    library.så("vises værmelding for i dag og de neste $ANTALL dagene", function(antall) {
      ctx.numberOfForecasts = parseInt(antall)+1
      ctx.assert.existsExactElements('ol.timeline--daily li.timeline-interval--daily', ctx.numberOfForecasts, 'Fant værmelding for '+antall+ ' dager.')
    })

    library.så("værmeldingen inneholder $SYMBOLER symboler pr dag", function(symboler) {
      ctx.numberOfSymbols = parseInt(symboler)
      var expectedForecastSymbols = ((ctx.numberOfForecasts*ctx.numberOfSymbols)-3) // Etterhvert som dagen i dag går blir det jo færre symboler inntil kun ett står igjen for i dag.
      ctx.assert.existsMoreElementsThan('ol.timeline--daily li figure.symbol', expectedForecastSymbols , 'Fant '+symboler+' værsymboler for alle dager.')
    })

    library.så("ved klikk på detaljer vises $SYMBOLERDETALJER symboler med tidsintervaller på maksimalt $MAKSLENGDE timer i sekvens", function(symbolerDetaljer, maksLengde) {
      ctx.maxIntervalHourLength = parseInt(maksLengde)
      ctx.numberOfSymbolsDetail = parseInt(symbolerDetaljer)
      // DOES NOT WORK: ctx.assert.findElementWait('#page .weather-table--daily:last-child').then( function(forecastDetail) {
      ctx.driver.findElements(webdriver.By.css('#page .weather-table--daily')).then(function (forecastDetails) {
        var forecastDetail = forecastDetails[forecastDetails.length-1];
        forecastDetail.click().then(function() {
          ctx.driver.sleep(500); // Wait 0,5 seconds to allow for loading
          ctx.assert.elementWaitVisible('.timeline-interval--hourly')
          ctx.driver.findElements(webdriver.By.css('.timeline-interval--hourly .time-axis-heading')).then(function (listIntervals) {
            listIntervals.length.should.equal(ctx.numberOfSymbolsDetail, 'Fant timesvarsel med '+ctx.numberOfSymbolsDetail+ ' symboler i detaljvarselet.')
            // Now check that all interval labels are in sequence
            forecastDetail.findElements(webdriver.By.css('.timeline-interval--hourly .time-axis-heading span')).then(function (listIntervalLabels) {
              _getListOfAttributes(listIntervalLabels, 'innerText', true).then( function(listLabels) {
                listLabels.length.should.be.greaterThan(1, 'Fant '+listLabels.length+', forventet minst 2, timesintervall for symboler i detaljvarselet.')
                AssertThatTimeintervalsAreInSequenceAndInOverlapping(listLabels)
              });
            })
          });
        });
      });
    })

    // Helper : Assert function for time intervals
    function AssertThatTimeintervalsAreInSequenceAndInOverlapping(intervalLabels) {
      if(intervalLabels===undefined || intervalLabels.length==0) { throw new Error('No time labels with time intervals were found. Required.'); }

      var lastInterval = parseInt(intervalLabels[0]); // Use first value as default
      var isStartInterval = true;
      intervalLabels.forEach(function(label) {
        if(label===undefined || label===null || label=='') { throw new Error('No time label provided for assertion, only a NULL value?'); }

        var labelHour = parseInt(label) // Current time interval (hour) label
        var isNextDay = ((labelHour+ctx.maxIntervalHourLength)>24) // Is current time interval after midnight and thus the following day?
        var isPrevDay = ((labelHour-ctx.maxIntervalHourLength)<0) // Was last interval before midnight

        // Intervals should be overlapping perfectly, if not it's an error
        if(isStartInterval===true && labelHour!=lastInterval) {
          throw Error('Start time interval "'+labelHour+'" does not overlap with the previous ending interval "'+lastInterval+'". Not allowed as all intervals must overlap perfectly.');
        }

        isStartInterval = !isStartInterval; // Toggle every other time

        // Next interval is later than previous - as expected - or the interval is the next day
        if(labelHour>=lastInterval || isNextDay===true) {
          lastInterval = labelHour;
        }
        // Next interval is smaller than  previous has to be the next day?
        else if(labelHour<=lastInterval && isPrevDay===true) {
          lastInterval = labelHour;
        }
        else {
          throw Error('Previous time interval start-or-end "'+lastInterval+'" is later in the day than the current "'+labelHour+'".');
        }
      });
    }
  }
};
