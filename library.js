var Yadda = require('yadda');
var Dictionary = Yadda.Dictionary;

module.exports.init = function(language) {
    var dictionary = new Dictionary();
    var library = language.library()
	// WORKAROUND: hotwiring and|og support until Yadda is reworked to support it
	library.and = library.og = function(args) {
		library.define.apply(this, arguments);
	}
    return library;	
};
