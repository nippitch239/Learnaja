@echo off
echo Starting Learnaja

start "Frontend - NPM Install & Vite Dev Server" cmd /k "cd /d "%~dp0frontend" && npm install && npm run dev"
start "Backend - NPM Install & Nodemon" cmd /k "cd /d "%~dp0backend" && npm install && npm run dev"

echo Both servers launched