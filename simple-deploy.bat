@echo off
echo.
echo ===============================================
echo   Simple GitHub Pages Deploy (No EZ-Deploy)
echo ===============================================
echo.

REM This bypasses EZ-Deploy completely and uses Git directly

echo 📝 Creating .nojekyll file for proper PWA support...
echo. > .nojekyll

echo.
echo 🔧 Fixing paths for GitHub Pages...
powershell -Command "(Get-Content index.html) -replace '/job-hunter-app/', '/JobBoardPWA/' | Set-Content index.html"
powershell -Command "(Get-Content manifest.json) -replace '/job-hunter-app/', '/JobBoardPWA/' | Set-Content manifest.json"
powershell -Command "(Get-Content sw.js) -replace '/job-hunter-app/', '/JobBoardPWA/' | Set-Content sw.js"

echo.
echo 📦 Committing changes...
git add -A
git commit -m "Deploy JobBoardPWA to GitHub Pages"

echo.
echo 🚀 Pushing to GitHub...
git push origin main

echo.
echo ===============================================
echo.
echo ✅ Done! Your site will be live at:
echo    https://[your-username].github.io/JobBoardPWA/
echo.
echo    (Replace [your-username] with your GitHub username)
echo.
echo 📱 GitHub Pages may take 5-10 minutes to activate.
echo.
pause
