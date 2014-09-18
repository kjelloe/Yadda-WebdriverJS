Yadda-WebdriverJS
=================

Demonstration of how to use a BDD-style approach to crossbrowser testing using Yadda-Mocha-Webdriverjs-[Browserstack|SauceLabs|PhantomJS]
Describe user stories in Yadda (https://github.com/acuminous/yadda), then map them to HTML/DOM operations in WebdriverJS. 
This allow for both headless (GhostDriver/PhantomJS) and cloud based (BrowserStack, SauceLabs etc) crossbrowser testing of the user stories.

1. DOWNLOAD, INSTALL/UNPACK and ADD TO PATH/ENVIRONMENT:

 node.js ->  http://nodejs.org/download/
 
 phantomjs -> http://phantomjs.org/download.html 
 
 chromedriver -> http://chromedriver.storage.googleapis.com/index.html?path=2.9/

2. INSTALL NODE PACKAGES:

 npm install

3. SAMPLE FEATURE/TESTS 

 Examples in Norwegian are ready to run in:

  features\search\YR-stedss�k.feature 
 
  features\search\YR-stedss�k-steps.js
 
 Examples in English are located in:
 
  example-features\en\YR-search.feature
  
  example-features\en\YR-search-steps.js

4. RUN REMOTE YADDA-BDD (BROWSERSTACK|SAUCELABS)

 runtests.bat android baseUrlToTest
 
 runtests.bat someprofile baseUrlToTest optionalTestGroupFolder

5. RUN LOCAL YADDA-BDD (PHANTOMJS)

 phantomjs --webdriver=8001
 
 runtests.bat phantomjs baseUrlToTest optionalTestGroupFolder            
