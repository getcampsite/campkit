const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');

const paths = require('../../utils/paths');
const configFactory = require('./webpack.config');

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

async function build(pkg, options) {
  try {
    console.log(chalk.cyan(``));
    console.log(chalk.cyan(`⛺  Campkit - build 📦`));
    console.log(chalk.cyan(``));

    const { source, destination } = pkg;

    // var dir = './.campkit';

    // if (!fs.existsSync(dir)) {
    //   fs.mkdirSync(dir);
    // }

    // const exampleBuildManifest = {
    //   functions: {
    //     userCreate: ['static/runtime/usercreate_a6769f6852830251a132.js'],
    //   },
    // };

    // fs.outputFileSync(
    //   '.campkit/build-manifest.json',
    //   JSON.stringify(exampleBuildManifest)
    // );

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

// function parseCampkitConfig(destination) {
//   const srcPath = paths.resolve(destination + '/main');
//   const entryFile = require(srcPath);
//   const config = entryFile.config();

//   const { runtime, region, stage, functions } = config;

//   console.log(config);

//   // console.log(functions);

//   functions.forEach(func => {
//     console.log(func);
//   });
// }

module.exports = {
  build,
};
