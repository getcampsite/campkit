const { resolve } = require('path');
const webpack = require('webpack');
const slsw = require('serverless-webpack');

module.exports = (async () => {
  const accountId = await slsw.lib.serverless.providers.aws.getAccountId();
  return {
    // entry: "./src/index",
    entry: slsw.lib.entries,
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    devtool: 'source-map',
    target: 'node',
    plugins: [
      new webpack.DefinePlugin({
        AWS_ACCOUNT_ID: `${accountId}`,
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    output: {
      libraryTarget: 'commonjs',
      path: resolve(__dirname, 'dist'), // .webpack
      filename: '[name].js',
    },
    module: {
      rules: [
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        { test: /\.tsx?$/, loader: 'ts-loader' },
      ],
    },
  };
})();
