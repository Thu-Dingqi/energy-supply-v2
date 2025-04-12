@echo off
echo Cleaning project...

:: Stop any running processes
taskkill /F /IM node.exe /T

:: Remove build folders
rd /s /q .next
rd /s /q node_modules

:: Clear npm cache
npm cache clean --force

:: Reinstall dependencies
pnpm install

:: Start dev server
pnpm dev