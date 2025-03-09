const path = require('path');

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  // Temporarily disable service worker config for testing
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Remove any service worker plugins for testing purposes
      if (env === 'production') {
        const workboxPluginIndex = webpackConfig.plugins.findIndex(
          (plugin) => plugin.constructor.name === 'GenerateSW'
        );

        // If the GenerateSW plugin exists, remove it
        if (workboxPluginIndex !== -1) {
          webpackConfig.plugins.splice(workboxPluginIndex, 1);
        }
      }

      return webpackConfig;
    },
  },
};