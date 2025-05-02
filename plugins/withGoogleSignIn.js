const { withPlugins } = require('expo/config-plugins');

const withGoogleSignIn = (config) => {
  // Add any necessary Android configuration
  if (config.android) {
    config.android = {
      ...config.android,
      package: config.android.package || 'com.anonymous.owlbynative',
    };
  }

  // Add any necessary iOS configuration
  if (config.ios) {
    config.ios = {
      ...config.ios,
      bundleIdentifier: config.ios.bundleIdentifier || 'com.anonymous.owlbynative',
    };
  }

  return config;
};

module.exports = withGoogleSignIn; 