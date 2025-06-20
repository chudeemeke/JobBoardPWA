@echo off
echo.
echo ======================================
echo   Deploying Critical Fixes
echo ======================================
echo.

echo Fixes applied:
echo - Fixed JavaScript syntax error in service worker registration
echo - Fixed manifest.json shortcut URLs
echo - Added short_name to shortcuts
echo.

git add index.html manifest.json
git commit -m "Fixed critical JavaScript error and manifest warnings"
git push origin main

echo.
echo ✅ Fixes deployed!
echo.
echo 🌐 Your PWA should now work properly at:
echo    https://chudeemeke.github.io/JobBoardPWA/
echo.
echo Wait 1-2 minutes for GitHub Pages to update, then refresh the page.
echo.
pause
