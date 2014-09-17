@echo off
setlocal

:param_check
if [%1] NEQ [] goto check_chromedriver
echo USAGE: runtests crossbrowserprofile [optional:testgroup/folder]
exit /b 1	

:check_chromedriver
where chromedriver > nul 2>&1
if not errorlevel 1 goto run
echo Could not find chromedriver
exit /b 1

:run
set testenv=%1
set testgroup=%2
node_modules\.bin\mocha --reporter spec --timeout 60000 run-yadda.js
endlocal