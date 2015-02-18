@echo off
setlocal

:param_check
if [%1] NEQ [] goto run
echo USAGE:  run-stubgenerator feature-file
exit /b 1	

:run
REM NB! Use your own browserstack key and user in environment variables for node mocha to read
set specfile=%1
set overwrite=no
set lang=no
..\node_modules\.bin\mocha --reporter spec --timeout 60000 generate-steps.js
endlocal