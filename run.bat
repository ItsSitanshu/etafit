@echo off
cd server
start /b nodemon server.js

cd ..
start /b npm run start

echo Press Ctrl+C to stop the server and client...

pause