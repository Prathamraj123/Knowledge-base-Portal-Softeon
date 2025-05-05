@echo off
echo Installing dependencies...
call npm install
call npm install --save-dev cross-env

echo Replacing Vite configuration for Windows...
echo Copying windows-vite.config.ts to vite.config.ts
copy /Y windows-vite.config.ts vite.config.ts

echo Replacing server vite.ts for Windows...
echo Copying windows-vite.ts to server/vite.ts
copy /Y windows-vite.ts server\vite.ts

echo Creating development script for Windows...
echo @echo off > run-dev.bat
echo set NODE_ENV=development >> run-dev.bat
echo npx tsx server/index.ts >> run-dev.bat

echo Creating production script for Windows...
echo @echo off > run-prod.bat
echo set NODE_ENV=production >> run-prod.bat
echo node dist/index.js >> run-prod.bat

echo Setup complete!
echo.
echo To start the development server, run:
echo   run-dev.bat
echo.
echo To build and start the production server:
echo   npm run build
echo   run-prod.bat

echo Note: Production build may not work properly on Windows.
echo We recommend using development mode for local testing.