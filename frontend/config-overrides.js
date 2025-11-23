const webpack = require('webpack');
module.exports = function override(config) {
  config.resolve = config.resolve || {};
  // All Node.js polyfills removed for browser-native BCH wallet extension support
  config.resolve.fallback = {
    ...config.resolve.fallback
  };
  // Remove ProvidePlugin for Buffer/process
  config.plugins = (config.plugins || []).filter(
    plugin => !(plugin instanceof webpack.ProvidePlugin)
  );
  return config;
};