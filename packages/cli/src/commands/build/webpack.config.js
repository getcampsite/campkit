const { resolve } = require('path');
const webpack = require('webpack');

module.exports = (options) => {
  const { stage = 'prod', source, destination } = options;

  return {
    entry: source,
    mode: stage === 'dev' ? 'development' : 'production',
    devtool: 'inline-source-map', // inline-source-map source-map
    target: 'node',
    externals: [{ 'aws-sdk': 'commonjs aws-sdk' }], // removes the local aws sdk to use the one provided by aws lambda
    plugins: [],
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    output: {
      libraryTarget: 'commonjs',
      path: resolve(__dirname, destination),
      filename: '[name].js',
    },
    module: {
      rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }],
    },
  };
};
