Yadda-WebdriverJS
=================

Demonstration of how to use a BDD-style approach to crossbrowser testing using Yadda-Mocha-Webdriverjs-[Browserstack|SauceLabs|PhantomJS]
Describe user stories in Yadda (https://github.com/acuminous/yadda), then map them to HTML/DOM operations in WebdriverJS. 
This allow for both headless (GhostDriver/PhantomJS) and cloud based (BrowserStack, SauceLabs etc) crossbrowser testing of the user stories.

DOWNLOAD, INSTALL/UNPACK and ADD TO PATH/ENVIRONMENT:
 node.js ->  http://nodejs.org/download/
 phantomjs -> http://phantomjs.org/download.html 
 chromedriver -> http://chromedriver.storage.googleapis.com/index.html?path=2.9/

INSTALL NODE PACKAGES:
 npm install

SAMPLE TESTS (In Norwegian)
 features\YR-stedssøk.feature
 features\YR-stedssøk-steps.js

RUN REMOTE YADDA-BDD (BROWSERSTACK|SAUCELABS)
 runtests.bat android
 runtests.bat someprofile

RUN LOCAL YADDA-BDD (PHANTOMJS)
 phantomjs --webdriver=8001
 runtests.bat phantomjs                        
