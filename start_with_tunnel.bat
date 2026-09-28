@echo off
title Portfolio Host + Cloudflare Tunnel
echo ========================================================
echo         PORTFOLIO HOST + CLOUDFLARE TUNNEL
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting local portfolio server on port 3000...
start "" python -m http.server 3000 --directory .

timeout /t 3 /nobreak >nul

set CLOUDFLARED="cloudflared"
if exist "C:\Program Files (x86)\cloudflared\cloudflared.exe" (
    set CLOUDFLARED="C:\Program Files (x86)\cloudflared\cloudflared.exe"
)

echo [2/2] Running Cloudflare Tunnel for portfolio.phanguard.org...
%CLOUDFLARED% tunnel --config "C:\Users\tvgja\.cloudflared\config.yml" run 293b39bf-2906-41b7-bfbd-00c78e8005fa

pause
