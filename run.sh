#!/bin/bash

check_command() {
  if ! command -v "$1" &>/dev/null; then
    echo "Error: $1 is not installed. Please install it."
    exit 1
  fi
}

check_command "node"
check_command "nodemon"
check_command "ngrok"
check_command "npm"
check_command "npx"
check_command "curl"
check_command "jq"
check_command "sed"


open_tab() {
  gnome-terminal --tab -- bash -c "$1; exec bash"
}

echo "Starting ngrok in a new window..."
open_tab "ngrok http 8080"

echo "Waiting for ngrok to initialize..."
sleep 10

NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')
if [ -z "$NGROK_URL" ]; then
  echo "Error: Could not retrieve ngrok URL. Ensure ngrok is running."
  exit 1
fi
echo "Ngrok is running at: $NGROK_URL"

echo "Starting server in a new window..."
open_tab "cd server && nodemon server.js"

if [ -f .env ]; then
  echo "Updating .env file with API_URL=$NGROK_URL"
  sed -i "s|API_URL=.*|API_URL=$NGROK_URL|g" .env && sed -i "s|^API_URL=.*|API_URL=$NGROK_URL|g" server/.env
else
  echo "Error: .env file not found. Please ensure it exists in the current directory."
  exit 1
fi

echo "Starting Expo project in a new window..."
open_tab "npx expo start"

echo "Setup completed! Check the terminals for server, ngrok, and Expo."
