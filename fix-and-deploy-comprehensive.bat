@echo off
echo.
echo ========================================
echo   JobBoardPWA Comprehensive Path Fixer
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo 🔧 Running comprehensive path fixer...
echo.

node fix-all-paths.js

echo.
echo ========================================
echo.

REM Ask if user wants to run tests
set /p test="Run quick test to verify paths? (y/n): "
if /i "%test%"=="y" (
    echo.
    echo 🧪 Running quick verification...
    node -e "console.log('✅ Node.js working'); const fs = require('fs'); const m = JSON.parse(fs.readFileSync('manifest.json', 'utf8')); console.log('✅ Manifest start_url:', m.start_url); console.log(m.start_url === '/JobBoardPWA/index.html' ? '✅ Paths look correct!' : '⚠️  Paths may still need fixing');"
    echo.
)

REM Ask if user wants to deploy
set /p deploy="Deploy to GitHub now? (y/n): "
if /i "%deploy%"=="y" (
    echo.
    echo 📤 Deploying to GitHub...
    git add -A
    git commit -m "Fixed all deployment paths - comprehensive fix"
    git push origin main
    echo.
    echo ✅ Deployment complete!
    echo.
    echo 🌐 Your PWA will be live at:
    echo    https://chudeemekee.github.io/JobBoardPWA/
    echo.
    echo 📱 Access from your phone to install as PWA!
) else (
    echo.
    echo 📝 Changes saved locally. Deploy when ready with:
    echo    git add -A
    echo    git commit -m "Fixed all deployment paths"
    echo    git push origin main
)

echo.
pause
