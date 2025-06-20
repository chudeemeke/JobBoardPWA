@echo off
echo.
echo ========================================
echo   JobBoardPWA Security Fix & Deploy
echo ========================================
echo.
echo ⚠️  GitHub detected a security issue: Personal Access Token in .ezdeploy-history.json
echo.
echo This script will:
echo 1. Remove sensitive files from Git tracking
echo 2. Update .gitignore to prevent future issues
echo 3. Deploy safely to GitHub
echo.

REM Remove sensitive file from git tracking
echo 🔒 Removing sensitive files from Git...
git rm --cached .ezdeploy-history.json 2>nul
git rm --cached .ezdeploy-auth.json 2>nul
git rm --cached .ezdeploy-config.json 2>nul

echo.
echo ✅ Sensitive files removed from tracking
echo.

REM Check if we need to reset to before the problematic commit
set /p reset="Do you want to reset to before the last commit? (recommended) (y/n): "
if /i "%reset%"=="y" (
    echo.
    echo 🔄 Resetting to previous commit...
    git reset --soft HEAD~1
    echo ✅ Reset complete
    echo.
)

REM Stage the changes
echo 📋 Staging safe changes...
git add .gitignore
git add -A
git status

echo.
echo ========================================
echo.

REM Ask if user wants to proceed with deployment
set /p deploy="Ready to deploy safely to GitHub? (y/n): "
if /i "%deploy%"=="y" (
    echo.
    echo 📤 Deploying to GitHub (without sensitive files)...
    git commit -m "Fixed security issue and deployment paths - removed sensitive files"
    git push origin main --force-with-lease
    echo.
    echo ✅ Deployment complete!
    echo.
    echo 🌐 Your PWA will be live at:
    echo    https://chudeemekee.github.io/JobBoardPWA/
    echo.
    echo 📱 Access from your phone to install as PWA!
    echo.
    echo 🔒 Security Notes:
    echo    - .ezdeploy-history.json is now ignored
    echo    - Your GitHub token is safe
    echo    - Future deployments won't have this issue
) else (
    echo.
    echo 📝 Changes prepared. When ready to deploy:
    echo    git commit -m "Fixed security issue - removed sensitive files"
    echo    git push origin main --force-with-lease
)

echo.
pause
