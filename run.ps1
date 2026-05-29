# Launch script for InvestWise Full-Stack

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Launching InvestWise Full-Stack Application..." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Start Spring Boot Backend in a separate PowerShell window
Write-Host "☕ Starting Spring Boot Backend (Port 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\mvnw.cmd spring-boot:run"

# Start Vite React Frontend in the current terminal window
Write-Host "⚡ Starting Vite React Frontend (Port 5173)..." -ForegroundColor Green
cd frontend
npm run dev
