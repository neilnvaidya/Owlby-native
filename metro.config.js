// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Add exclusions for problematic directories
config.resolver.blockList = [
  /\.vercel\/.*/,
  /\.expo\/.*/,
  /node_modules\/.*\/node_modules\/react-native\/.*/,
];

module.exports = config;
