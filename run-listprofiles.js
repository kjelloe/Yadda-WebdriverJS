var fs = require('fs');
var ignorePropList = new Array('serverurl');

// Loading configs from testprofiles defined
fs.readdir(__dirname+'/testprofiles', function(err, files) {
	if (err) throw new Error('Could not read testprofiles from directory: ' + __dirname+'/testprofiles')
	files.forEach(function(testprofileName) {
		var testConfig = require('./config-setup').init('./testprofiles/'+ testprofileName);
		// Fetching profiles
		var testProfiles = testConfig.getTestProfilesMatching();
		// Listing test profiles
		console.log('\nConfigured browser profiles in config "./testprofiles/'+testprofileName+'" are as follows:');

		var count = 0;
		var list = '';
		for(var profile in testProfiles) {
			if(ignorePropList.indexOf(profile) == -1) { // It not ignoring property 
				count++;
				console.log( (count<10? ' ' : '') + count + '. ' + profile);
				list += ','+profile
			}
		};
		
		console.log('\nALL '+ testprofileName +': ' + list.substring(1));
	});
});

