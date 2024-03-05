@echo off
node -v
if %errorlevel% NEQ 0 goto err
goto run
:err
echo node&npm requires, install: https://nodejs.org/en/download
:run
npm install
build.bat