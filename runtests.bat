@echo off
setlocal

:param_check
if [%1] NEQ [] goto check_chromedriver
echo USAGE: runtests browserProfileToRunIn http://sometesturl/ [optional:testgroup/folder]
exit /b 1	

:check_chromedriver
where chromedriver > nul 2>&1
if not errorlevel 1 goto run
echo Could not find chromedriver
exit /b 1

:run
REM NB! Use your own browserstack key and user in environment variables for node mocha to read
set BROWSERSTACK_USER='' 
set BROWSERSTACK_KEY='' 
set testenv=%1
set testurl=%2
set testgroup=%3
node_modules\.bin\mocha --reporter spec --timeout 60000 run-yadda.js
endlocal