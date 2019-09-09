module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }]
    /*["transform-remove-console", { "exclude": [ "error", "warn"] }]*/
  ]
};
