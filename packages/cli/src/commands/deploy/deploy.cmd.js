const chalk = require('chalk');
const path = require('path');
const paths = require('../../utils/paths');

async function deploy(pkg, options) {
  console.log(chalk.cyan(``));
  console.log(chalk.cyan(`⛺  Campkit - deploy 🚀`));
  console.log(chalk.cyan(``));
  console.log(pkg, options, paths.root);
  const c = require(path.join(paths.root, 'dist', 'main'));
  console.log(c);
}

module.exports = {
  deploy,
};
