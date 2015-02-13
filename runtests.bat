@echo off
setlocal

:param_check
if [%1] NEQ [] goto run
echo USAGE: runtests browserProfileToRunIn http://sometesturl/ [optional:testgroup/folder]
exit /b 1	

:run
REM NB! Use your own browserstack key and user in environment variables for node mocha to read
set BROWSERSTACK_USER=''
set BROWSERSTACK_KEY=''
set WEBDRIVERURI=http://localhost:8001
set testenv=%1
set testurl=%2
set testgroup=%3
node_modules\.bin\mocha --reporter spec --timeout 60000 run-yadda.js
endlocal