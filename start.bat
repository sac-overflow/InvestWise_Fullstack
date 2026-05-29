@echo off
echo ==========================================================
echo 🚀 Launching InvestWise Full-Stack Application...
echo ==========================================================

echo ☕ Starting Spring Boot Backend (Port 8080)...
start cmd /k "cd backend && mvnw.cmd spring-boot:run"

echo ⚡ Starting Vite React Frontend (Port 5173)...
cd frontend && npm run dev
