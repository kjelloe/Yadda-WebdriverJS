var fs = require('fs')
  , fsUtils = require('recur-fs')
  , Interfake = require('interfake')
  , path = require('path')
  , qs = require('querystring')
 
  , readdir = fsUtils.readdir.sync
  , fake = new Interfake({debug: false})
  , files = []
  , date = new Date()

var _ = require("lodash");
_.mixin(require("lodash-deep"));
  
var fakedDataIndex = new Array(); // Data storage for in memory override
 
module.exports = {
  init : function(url, port, sourceDir, endpointList ) {
	console.log('  Reading json files from directory: ' + sourceDir);
	// Gather all directories with endpoints
	readdir(sourceDir, function (resource, stat) {
	  if (stat.isFile()) {
		files.push(resource);
		// Skip
		return false;
	  }
	  return true;
	}).filter(function (dir) {
	  return getEndpointFile(dir) != null;
	}).forEach(function (dir) {
	  var basename = dir.replace(sourceDir, '')
		, filepath = getEndpointFile(dir)
		, name = path.basename(dir)
		, headers = { expires: date.toUTCString() }
		, query;

	  if (~filepath.indexOf('#')) { 
		query = qs.parse(filepath.slice(filepath.indexOf('#') + 1));
	  }

	  // Serve endpoint or proxy
	  if (~endpointList.indexOf(name)) {
		console.log('  faking ', name, ' at ', basename);
		fakedDataIndex[name] = JSON.parse(fs.readFileSync(filepath)); // Storing data in memory
		fake.get(basename).delay(300).body(fakedDataIndex[name]).query(query).responseHeaders(headers);
		fake.post(basename).delay(300).body(fakedDataIndex[name]).query(query).responseHeaders(headers); // DEBUG: adding post support
	  } else {
		console.log('  proxying ', url + basename);
		var route = fake.get(basename);
		// Allow any queries to match
		if (query) {
		  for (var prop in query) {
			query[prop] = /.+/;
		  }
		  route.query(query);
		}
		route.proxy(url + basename);
	  }
	});

	fake.listen(port);	
  },
  stop: function() {
	fake.stop();
  },
  getChildren: function(storageName, parentPath) {
	var list = new Array()
	this.every(storageName, parentPath, function(childObject) {
		list.push(childObject)
	});
	return list
  },
  get: function(storageName, objectPath) {
	var data = getData(storageName)
	this.getObject(data, objectPath);
  },
  getObject: function(dataObject, objectPath) {
	return _.deepGet(dataObject, objectPath)
  },
  update: function(storageName, objectPath, objectData) {
	var data = getData(storageName)
	this.updateObject(data, objectPath, objectData);
  },
  updateObject: function(dataObject, objectPath, objectData) {
	_.deepSet(dataObject, objectPath, objectData);
  },
  every: function(storageName, objectPath, callback) {
	var data = getData(storageName)
	var listObjects = _.deepGet(data, objectPath)
	
	if(listObjects===undefined || listObjects.length==0) throw new Error('No objects found for json path: ' + objectPath)
	
	listObjects.forEach(function (innerObject) {
		return callback.apply(this,[innerObject])
	});
  }
};

// Get endpoint file for 'dir'
function getEndpointFile (dir) {
  for (var i = 0; i < files.length; i++) {
    if (path.dirname(files[i]) == dir) return files[i];
  }
  return null;
}

function getData(storageName) {
	var data = fakedDataIndex[storageName]
	if(data===undefined || data===null) throw new Error("No faked data stored for endpoint-name: " + storageName); 
	return data;
}