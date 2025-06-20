@echo off
echo.
echo ========================================
echo   JobBoardPWA Deployment Path Fixer
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

echo 🔧 Running path fixer...
echo.

node fix-deployment-paths.js

echo.
echo ========================================
echo.

REM Ask if user wants to deploy
set /p deploy="Deploy to GitHub now? (y/n): "
if /i "%deploy%"=="y" (
    echo.
    echo 📤 Deploying to GitHub...
    git add -A
    git commit -m "Fixed deployment paths for GitHub Pages"
    git push origin main
    echo.
    echo ✅ Deployment complete!
    echo.
    echo 🌐 Your PWA will be live at:
    echo    https://[your-username].github.io/JobBoardPWA/
    echo.
    echo    (Replace [your-username] with your GitHub username)
) else (
    echo.
    echo 📝 Changes saved locally. Deploy when ready with:
    echo    git add -A
    echo    git commit -m "Fixed deployment paths"
    echo    git push origin main
)

echo.
pause
