@echo off
echo.
echo ===============================================
echo   EZ-Deploy Security Migration
echo ===============================================
echo.
echo This will convert your plain text config to encrypted format.
echo.
pause

cd ..\EZ-Deploy
node scripts\migrate-config.js

echo.
pause
