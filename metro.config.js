// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

module.exports = {
  ...getDefaultConfig(__dirname),
  resolver: {
    ...getDefaultConfig(__dirname).resolver,
    blockList: exclusionList([
      /node_modules\/ws\/.*/,
      /node_modules\/stream\/.*/,
    ]),
    extraNodeModules: {
      ...(getDefaultConfig(__dirname).resolver.extraNodeModules || {}),
      ws: require.resolve('./shim/ws.js'),
    },
  },
};
