﻿Yadda-WebdriverJS
=================

Demonstration of how to use a BDD-style approach to crossbrowser testing using Yadda-Mocha-Webdriverjs-[Browserstack|SauceLabs|PhantomJS]
Describe user stories in Yadda (https://github.com/acuminous/yadda), then map them to HTML/DOM operations in WebdriverJS. 
This allow for both headless (GhostDriver/PhantomJS) and cloud based (BrowserStack, SauceLabs etc) crossbrowser testing of the user stories.

1. DOWNLOAD, INSTALL/UNPACK and ADD TO PATH/ENVIRONMENT:

 node.js ->  http://nodejs.org/download/
 
 phantomjs -> http://phantomjs.org/download.html [or fetch custom PhantomJS 2.x build with mocking support from https://github.com/kjelloe/phantomjs/tree/master/bin-win32 ]
  
2. INSTALL NODE PACKAGES:

 npm install

3. CONFIGURE TEST PROFILES/CONFIGURATION

  If applicable, edit config.js and add or remove configuration profiles. By default 1 phantomjs and 29 browserstack profiles are included. SauceLabs configuration may be added.

4. HOW TO RUN YADDA-BDD REMOTELY ON BROWSERSTACK or SAUCELABS 

 Edit runtests.bat or runtests.sh and set your Browserstack username and access key [Sign up for free trial here: https://www.browserstack.com/users/sign_up go to https://www.browserstack.com/automate to find "Username" and "Access Keys"]
 
 Usage: runtests.bat someprofile baseUrlToTest optionalTestGroupFolder
 
5. HOW TO RUN YADDA-BDD LOCALLY USING PhantomJS

 Start phantomJs as a local process: phantomjs --webdriver=8001 
 
 Usage: runtests.bat phantomjs baseUrlToTest optionalTestGroupFolder           
  
6. RUNNING DEMO ON SEVERAL DEVICES

 runtests.bat phantomjs http://yr.cloudapp.net demo
 
 runtests.bat android http://yr.cloudapp.net demo
 
 runtests.bat iphone http://yr.cloudapp.net demo
  
7. FURTHER SAMPLE FEATURE TESTS 

 Demo features tests are found in:

  features\demo\YR-stedsøk.feature 
 
  features\demo\YR-stedsøk-steps.js

 Examples in Norwegian are ready to run in:

  example-features\search\YR-stedssøk.feature 
 
  example-features\search\YR-stedssøk-steps.js
 
 Examples in English are located in:
 
  example-features\en\YR-search.feature
  
  example-features\en\YR-search-steps.js
