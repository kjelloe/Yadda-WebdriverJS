@echo off
setlocal

:param_check
if [%1] NEQ [] goto run
echo USAGE: runtests browserProfileToRunIn http://sometesturl/ [optional:testgroup/folder]
exit /b 1	

:run
REM NB! Use your own browserstack or saucelabs key and user in environment variables for node mocha to read
set TESTSERVICE_USER=
set TESTSERVICE_ACCESSKEY=
set testprofiles=./testprofiles/browserstack
set WEBDRIVERURI=http://localhost:8002
set testenv=%1
set testurl=%2
set testgroup=%3
set timeout=12000

IF NOT EXIST node_modules\.bin\mocha (
echo ERROR; MISSING FILES: Please run 'npm install' to install test framework and dependencies
exit /b 1
)
node_modules\.bin\mocha --reporter spec --timeout 180000 run-yadda.js
endlocal
