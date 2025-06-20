@echo off
echo.
echo ===============================================
echo   ProjectDashboard v2 - Test Runner
echo   CC v6.5 Compliant Testing Framework
echo ===============================================
echo.

cd "C:\Users\Destiny\iCloudDrive\Documents\AI Tools\Anthropic Solution\Projects\ProjectDashboard-v2"

echo 📦 Installing dependencies if needed...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing packages...
    npm install
)

echo.
echo 🧪 Available Test Commands:
echo.
echo   1. Run all unit tests
echo   2. Run tests with UI (interactive)
echo   3. Run tests with coverage report
echo   4. Run e2e tests (Playwright)
echo   5. Run ALL tests (unit + e2e)
echo   6. Watch mode (auto-run on changes)
echo.

set /p choice="Select test option (1-6): "

echo.

if "%choice%"=="1" (
    echo Running unit tests...
    npm run test:run
) else if "%choice%"=="2" (
    echo Opening test UI...
    npm run test:ui
) else if "%choice%"=="3" (
    echo Running tests with coverage...
    npm run test:coverage
) else if "%choice%"=="4" (
    echo Running e2e tests...
    npm run test:e2e
) else if "%choice%"=="5" (
    echo Running ALL tests...
    npm run test:all
) else if "%choice%"=="6" (
    echo Starting watch mode...
    npm run test:watch
) else (
    echo Invalid choice!
)

echo.
pause
