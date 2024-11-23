#!/bin/bash

cd server && nohup nodemon server.js > server.log 2>&1 &

cd ../shishu && nohup npm run start > client.log 2>&1 &

SERVER_PID=$!
CLIENT_PID=$!

cleanup() {
    kill $SERVER_PID
    kill $CLIENT_PID
    echo "Server and client processes have been terminated."
    exit 0
}

trap cleanup SIGINT SIGTERM

while true; do
    sleep 1
done
