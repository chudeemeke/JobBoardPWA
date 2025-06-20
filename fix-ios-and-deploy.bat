@echo off
echo.
echo ========================================
echo   iOS PWA Icon Fix for iPhone/Safari
echo ========================================
echo.
echo This will fix the "I" icon issue on your iPhone
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Opening manual icon generator...
    echo.
    start generate-ios-icons.html
    echo.
    echo 1. Download all icons from the browser
    echo 2. Place them in the correct folders
    echo 3. Run deploy-ios-fix.bat to deploy
    pause
    exit /b
)

echo 🔧 Running iOS icon setup...
node fix-ios-icons.js

echo.
echo 📝 Updating manifest.json for iOS...

REM Update manifest to ensure iOS compatibility
node -e "const fs = require('fs'); const m = JSON.parse(fs.readFileSync('manifest.json')); m.display = 'standalone'; m.orientation = 'any'; fs.writeFileSync('manifest.json', JSON.stringify(m, null, 2));"

echo.
echo ========================================
echo.

set /p generate="Generate icons now? (y/n): "
if /i "%generate%"=="y" (
    echo.
    echo 🎨 Opening icon generator...
    start generate-ios-icons.html
    echo.
    echo Please:
    echo 1. Click "Download All Icons" in the browser
    echo 2. Move the downloaded icons to your project
    echo 3. Come back here and press any key
    echo.
    pause
)

echo.
set /p deploy="Deploy iOS fixes to GitHub? (y/n): "
if /i "%deploy%"=="y" (
    echo.
    echo 📤 Deploying iOS fixes...
    git add -A
    git commit -m "Fixed iOS PWA icons - proper JH icon instead of 'I'"
    git push origin main
    echo.
    echo ✅ iOS fixes deployed!
    echo.
    echo 📱 On your iPhone:
    echo 1. Go to Settings > Safari > Clear History and Website Data
    echo 2. Visit https://chudeemeke.github.io/JobBoardPWA/
    echo 3. Tap Share button > Add to Home Screen
    echo 4. You should now see "JH" icon!
    echo.
    echo 💡 If you still see "I":
    echo    - Delete the old app from home screen first
    echo    - Clear Safari cache again
    echo    - Try in Private browsing mode
) else (
    echo.
    echo 📝 Changes saved locally. Deploy when ready.
)

echo.
pause
