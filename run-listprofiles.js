// Loading config
var testConfig = require('./config').init();
// Fetching profiles
var testProfiles = testConfig.getTestProfilesMatching();
// Listing test profiles
console.log('Configured Browserstack testprofiles in "config.js" are as follows:');
var count = 0;
var list = '';
for(var profile in testProfiles) {
	count++;
	console.log( (count<10? ' ' : '') + count + '. ' + profile);
	list += ','+profile
};

console.log('\nALL: ' + list.substring(1));
