var webdriver = require('selenium-webdriver')
	, should = require('should');
	
exports.steps = {
	using: function(library, ctx) {
		library.når("en bruker besøker UT beta nettsidene for andre gang", function() {
			ctx.driver.get(ctx.testUrl)
			.then(function() {
				ctx.assert.elementWaitVisible('div.developerbanner');
			});
		});		
				
		library.så("skal sist besøkte sider fra forrige besøk vises", function() {
			ctx.assert.elementWaitVisible('#sistbesokt').then( function() {
				ctx.assert.existsMoreElementsThan('#sistbesokt li', 0, 'Det finnes listeplugg for sist besøkte sider');
			});
		})
	}
};
