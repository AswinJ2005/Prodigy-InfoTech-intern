@echo off
echo ========================================
echo Employee Management System - Quick Start
echo ========================================
echo.
echo Starting Backend Server...
echo.

cd backend
start cmd /k "npm start"

timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Server...
echo.

cd ../frontend
start cmd /k "npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Login with:
echo Username: admin
echo Password: admin123
echo ========================================
