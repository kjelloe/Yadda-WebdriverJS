var webdriver = require('selenium-webdriver')
  , should = require('should');
  
exports.steps = {
  using: function(library, ctx) {
      
    /* Basic example on how to openingen a webpage:		
    library.når("bruker åpner nettsiden", function() {
      ctx.driver.get(ctx.testUrl + 'hytte/fake')
      .then(function() {
        ctx.assert.elementWaitVisible('body');
      });
    });		
    */
    
    /* FEATURE: 4393 - Bruker ser hytteside med nødvendig informasjon*/

    library.når("bruker åpner hyttesiden ", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("finnes det et felt som sier når informasjonen ble siste oppdatert ihht krav UT-4928", function() {
      // TODO: Implement step, i.e: ctx.assert.existsElement('Selector', 'Finnes');
    })

    library.så("bruker ser tittel på hyttekjernesiden ihht krav UT-4928", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser høyde over havet på hyttekjernesiden ihht krav UT-4971", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser bildegalleri på hyttekjernesiden ihht krav UT-4943", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser fokuskart på hyttekjerneside ihht krav UT-4992", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser type på hyttekjernesiden ihht krav UT-5000 ", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser betjeningsgrad på hyttekjernesiden ihht krav UT-4950", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser brødtekst på hyttekjernesiden ihht krav UT-4957", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser fasiliteter på hyttekjernesiden ihht krav UT-5030", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser relaterte turer i nærheten på hyttekjernesiden ihht krav UT-5051", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser relaterte hytter i nærheten på hyttekjerneside ihht krav UT-5058", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser relaterte steder i nærheten på hyttekjerneside ihht krav UT-5283", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser kontaktinformasjon på hyttekjernesiden ihht krav UT-5016", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser åpningstider på hyttekjernesiden ihht krav UT-5001", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser adkomst på hyttekjernesiden ihht krav UT-5023", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser nettkamera på hyttekjernesiden ihht krav UT-5044", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser kartblad på hyttekjernesiden ihht krav UT-5037", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser overnattingsmuligheter på hyttekjerneside ihht krav UT-5065", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })

    library.så("bruker ser facebook-url på hyttekjerneside ihht krav UT-5184", function() {
      // TODO: Implement step, i.e: ctx.assert.VisibleElement('Selector', 'Vises');
    })
  }
};
