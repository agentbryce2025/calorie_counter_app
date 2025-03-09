const { InjectManifest } = require('workbox-webpack-plugin');
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
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Only add InjectManifest in production build
      if (env === 'production') {
        const workboxPluginIndex = webpackConfig.plugins.findIndex(
          (plugin) => plugin.constructor.name === 'GenerateSW'
        );

        // If the GenerateSW plugin exists, remove it
        if (workboxPluginIndex !== -1) {
          webpackConfig.plugins.splice(workboxPluginIndex, 1);
        }

        // Add InjectManifest plugin
        webpackConfig.plugins.push(
          new InjectManifest({
            swSrc: path.resolve(__dirname, 'src/service-worker.ts'),
            swDest: 'service-worker.js',
            exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          })
        );
      }

      return webpackConfig;
    },
  },
};