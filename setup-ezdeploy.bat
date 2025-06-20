@echo off
echo.
echo ===============================================
echo   EZ-Deploy Manual Configuration
echo ===============================================
echo.

set /p token="Enter your GitHub token: "
set /p username="Enter your GitHub username: "

echo Creating EZ-Deploy configuration...

mkdir "%USERPROFILE%\.ezdeploy" 2>nul

echo { > "%USERPROFILE%\.ezdeploy\config.json"
echo   "github": { >> "%USERPROFILE%\.ezdeploy\config.json"
echo     "token": "%token%", >> "%USERPROFILE%\.ezdeploy\config.json"
echo     "username": "%username%" >> "%USERPROFILE%\.ezdeploy\config.json"
echo   } >> "%USERPROFILE%\.ezdeploy\config.json"
echo } >> "%USERPROFILE%\.ezdeploy\config.json"

echo.
echo ✅ Configuration saved!
echo.
echo Now you can run:
echo   npx ez-deploy push -m "Deploy JobBoardPWA"
echo.
pause
