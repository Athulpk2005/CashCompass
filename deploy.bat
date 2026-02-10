@echo off
echo ========================================
echo CashCompass Firebase Deployment
echo ========================================

cd /d %~dp0

echo.
echo Step 1: Setting Firebase project...
firebase use cashcompass-a9996

echo.
echo Step 2: Initializing Firebase Hosting...
echo Please answer the following:
echo - Public directory? dist
echo - Single-page app? Yes
echo - GitHub? No
firebase init hosting

echo.
echo Step 3: Building frontend...
cd Frontend
npm run build
cd ..

echo.
echo Step 4: Deploying to Firebase...
firebase deploy --only hosting

echo.
echo ========================================
echo Deployment Complete!
echo Your app: https://cashcompass-a9996.web.app
echo ========================================
pause
