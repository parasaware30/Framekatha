@echo off
title FrameKatha 24/7 Cloud Deployment
cd /d "%~dp0"
echo ===================================================
echo   FrameKatha - GitHub Code Upload (24/7 Live)
echo ===================================================
echo.
echo Please authorize in the browser popup if asked...
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================
    echo   [SUCCESS] Code uploaded to GitHub successfully!
    echo ===================================================
) else (
    echo [FAILED] Please check your internet connection or login.
)
pause
