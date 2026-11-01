@echo off
title AICTE Complaint360 - SIH26264
cd /d "%~dp0"

set "NPM=C:\Users\bhada\.nodejs\node-v20.18.0-win-x64\npm.cmd"
set "NODE=C:\Users\bhada\.nodejs\node-v20.18.0-win-x64\node.exe"

:: Check if already running
netstat -ano | findstr ":5173" | findstr "LISTENING" >nul 2>nul
if not errorlevel 1 (
    start "" "http://localhost:5173/"
    goto END
)

:: Install deps if missing
if not exist "node_modules\" (
    echo Installing dependencies...
    "%NPM%" install
)

:: Open browser after 4 seconds
start "" cmd /c "ping -n 5 127.0.0.1 >nul & start """" http://localhost:5173/"

:: Start Vite dev server
"%NPM%" run dev

:END
