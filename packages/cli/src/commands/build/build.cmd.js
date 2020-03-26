const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');

const configFactory = require('./webpack.config');
const paths = require('../../utils/paths');

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

async function build(pkg, options) {
  try {
    console.log(chalk.cyan(``));
    console.log(chalk.cyan(`⛺  Campkit - build 📦`));
    console.log(chalk.cyan(``));

    const { source, destination } = pkg;

    const config = configFactory({
      stage: 'prod',
      source: paths.resolve(source),
      destination: paths.resolve(destination),
    });
    const compiler = webpack(config);

    const stats = await compileCode(compiler);
    const info = stats.toJson({
      chunks: false, // Makes the build much quieter
      colors: true, // Shows colors in the console
    });

    if (stats.hasErrors()) {
      console.log(chalk.yellow('Compiled with errors.\n'));
      console.log(info.errors);
      return;
    }

    if (stats.hasWarnings()) {
      console.log(chalk.yellow('Compiled with warnings.\n'));
      console.log(info.warnings);
      return;
    }

    console.log(chalk.green('Compiled successfully.\n'));
    return;
  } catch (e) {
    console.log(chalk.red(`error`));
    console.log(e);
    return;
  }
}

function compileCode(compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.log(chalk.red(err.details));
        }
        return reject(err);
      }
      return resolve(stats);
    });
  });
}

module.exports = {
  build,
};
