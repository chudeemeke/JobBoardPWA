@echo off
echo.
echo ===============================================
echo   Running EZ-Deploy Tests
echo ===============================================
echo.

cd ..\EZ-Deploy

echo Running all tests...
npm test

echo.
echo ===============================================
echo.
echo To run specific tests:
echo   npm test -- path-fixer
echo   npm test -- github-api
echo   npm test -- deployer
echo.
pause
