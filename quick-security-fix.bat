@echo off
REM Quick one-liner to fix security issue and deploy

git rm --cached .ezdeploy-history.json & git reset --soft HEAD~1 & git add .gitignore & git add -A & git commit -m "Fixed security issue - removed sensitive files, paths corrected" & git push origin main --force-with-lease

echo.
echo Done! Your PWA should now deploy successfully.
echo Visit: https://chudeemekee.github.io/JobBoardPWA/
pause
