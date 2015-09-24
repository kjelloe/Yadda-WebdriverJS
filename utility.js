var mkdirp = require('mkdirp');
var fs = require('fs');
var webdriver = require('selenium-webdriver')

var currentWorkingPath = __dirname;
var self;

// Extensions
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

module.exports = {
  init : function(currentDriver) {		
    self = this;
    return self;
  },	
  getWorkingDir : function() {
    return currentWorkingPath;
  },
  createDirIfNotExists : function(dirname) {
    var dirDone = webdriver.promise.defer();
    mkdirp(dirname, function (err) {
      if (err) throw new Error('ERROR: Could not create requestsed directory: "' + dirname + '", due to ERROR: ' + err);
      dirDone.fulfill();
    });		
    return dirDone.promise;
  },
  takeTestScreenshot : function(testDriver, test) {
    var path = currentWorkingPath + '/screenshots/'+ (test.state != 'passed' ? 'failed/' : 'passed/');
    self.createDirIfNotExists(path).then( function() {
      var filepath = path + test.title.replace(/\W+/g, '_').toLowerCase() + '.png';
      testDriver.takeScreenshot().then(function(data) {
        fs.writeFileSync(filepath, data, 'base64');
      });
    });
  }
};
