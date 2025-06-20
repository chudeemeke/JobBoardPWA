@echo off
echo.
echo ===============================================
echo   JobBoardPWA Deployment Setup
echo ===============================================
echo.

REM First commit the fixes
echo 📝 Committing path fixes...
git add -A
git commit -m "Fixed paths for GitHub Pages deployment (changed /job-hunter-app/ to /JobBoardPWA/)"

echo.
echo 🔐 Setting up GitHub credentials...
echo.
echo You'll need a GitHub Personal Access Token.
echo.
echo 1. Go to: https://github.com/settings/tokens/new
echo 2. Give it a name like "EZ-Deploy"
echo 3. Select scopes: repo (all), workflow, admin:repo_hook
echo 4. Generate token and copy it
echo.
pause

REM Initialize EZ-Deploy
call npx ez-deploy init

echo.
echo ===============================================
echo.
echo ✅ Setup complete! Now deploying...
echo.
pause

REM Deploy the app
call npx ez-deploy push -m "Deploy JobBoardPWA - AI-powered job hunting application"

echo.
echo 🎉 Deployment complete!
echo.
echo Your app will be live at:
echo https://[your-username].github.io/JobBoardPWA/
echo.
echo (It may take a few minutes for GitHub Pages to activate)
echo.
pause
