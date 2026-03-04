@echo off
echo Starting Learnaja

start "Frontend - Vite Dev Server" cmd /k "cd /d "%~dp0frontend" && npm run dev"
start "Backend - Nodemon" cmd /k "cd /d "%~dp0backend" && nodemon index.js"

echo Both servers launched