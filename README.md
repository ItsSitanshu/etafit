<div align="center">
  <img src=".github/logo.png" alt="EtaFit Logo" width="200" />
</div>

<h1 align="center"><a href="https://eta-fit.web.app">EtaFit</a>: Fitness Simplified</h1>


### Requirements

- **Node.js**: v14 or later
- **Expo CLI**: `npm install -g expo-cli`
- **React Native**: For mobile app development

### Running Locally

```bash

git clone https://github.com/ItsSitanshu/etafit.git

# Session 1
# You will need a https://supabase.com/ account and a registered project to run the server side code
cd server/ 
node server.js

# Session 2
npm i -g ngrok # sudo npm i -g ngrok
ngrok http 8080

# Ngrok will give you a link that needs to be pasted into the .env file as API_URL

# Session 3
cd etafit/
npm i
npx expo start
```
