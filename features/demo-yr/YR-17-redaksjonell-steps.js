var webdriver = require('selenium-webdriver')
    , assert = require('selenium-webdriver/testing/assert')
  , should = require('should');

exports.steps = {
  using: function (library, ctx) {
    library.når('jeg er inne på en hvilken som helst YR-side', function () {
      ctx.assert.loadUrl(ctx.testUrl + 'nb');
    });

    library.så('skal jeg se logo og navn for NRK, Meterologisk instititutt og redaksjonelt ansvarlig.', function () {
      //NRK og MET logo
      ctx.driver.findElement(webdriver.By.className('page-footer__logos'))
      .then(function (footer) {
        footer.findElement(webdriver.By.className('logo-nrk'))
        .then(function (nrk) {
          nrk.getAttribute('href').then(function (text) { text.should.eql('http://www.nrk.no/'); });
        });
        footer.findElement(webdriver.By.className('logo-met'))
        .then(function (met) {
          met.getAttribute('href').then(function (text) { text.should.eql('http://www.met.no/'); });
        });
      });

      //Redaksjonelt ansvarlig
      ctx.driver.findElement(webdriver.By.tagName('footer'))
      .then(function (footer) {
        footer.getText()
        .then(function (text) {
          text.should.containEql('Redaktør');
          text.should.containEql('Ansvarlig redaktør');
          text.should.containEql('Meteorologisk ansvarlig');
        })
      })
    });

    library.så('skal jeg kunne se en lenke som heter "$LENKENAVN"', function (lenkenavn) {
      var foundName = ''
      ctx.driver.findElements(webdriver.By.css('footer .page-footer__nav ul li a')).then( function(linkElements) {			
        for(var i=0;i<linkElements.length;i++) { // Check all link texts found
          linkElements[i].getText().then(function(text) {											
            if(text==lenkenavn) { foundName = text }
          });
        }
      }).then(function () {			
        foundName.should.containEql(lenkenavn, 'Lenke med tekst "' + lenkenavn + '" ble funnet')
      });
    });

    library.og('når jeg klikker på "$LENKENAVN" skal jeg kunne få opp et kontaktskjema som jeg kan fylle ut', function (lenkenavn) {
      ctx.driver.findElements(webdriver.By.css('footer .page-footer__nav ul li a')).then( function(linkElements) {
        for(var i=0;i<linkElements.length;i++) { // Check all link texts found
          var currentLink = linkElements[i]
          currentLink.getText().then(function(linkText) {	
            if(linkText==lenkenavn) { // Sjekk at funnet lenke er kontaktlenken
              linkText.should.containEql(lenkenavn, 'Lenke med tekst "' + lenkenavn + '" ble funnet')
              // NB: Første tiltenkte løsning virker ikke; Klikke på kontaktlenken og se at skjema blir lastet i nytt vindu/flik
              // WORKAROUND: Hente ut lenke og navigere til den i samme vindusflik
              currentLink.getAttribute('href').then(function (linkHref) {
                linkHref.should.match(/^(http:|https:)/g)
                ctx.driver.get(linkHref).then( function() {
                  ctx.assert.elementContainsText('h1','Send oss en henvendelse');
                });
              });
            }
          });
        };
      });
    });
  }
};
