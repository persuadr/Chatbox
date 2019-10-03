// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob-all');

module.exports = {
  // productionSourceMap: false,
  configureWebpack: {
    mode: process.env.NODE_ENV,
    output: {
      libraryExport: 'default',
    },
    plugins: [
      /* new UglifyJsPlugin({
        extractComments: true,
      }), */
      new PurgecssPlugin({
        paths: glob.sync([
          './src/components/*.vue',
          './src/components/index.js',
        ]),
      }),
    ],
  },
  pluginOptions: {
    quasar: {
      treeShake: true,
    },
  },
  transpileDependencies: [
    /[\\\/]node_modules[\\\/]quasar[\\\/]/,
  ],
};
