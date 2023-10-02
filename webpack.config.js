const path = require('path');

module.exports = [{
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'respec-plugins'),
    filename: 'respec-vc-jose-cose.js',
  },
  plugins: [],
  watch: true
}];
