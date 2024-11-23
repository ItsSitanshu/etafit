module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "babel-plugin-dotenv-import",
        {
          "moduleName": "react-native-dotenv",
          "path": ".env"
        }
      ]
    ]
  };
};
