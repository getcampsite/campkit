#!/usr/bin/env node

const sade = require('sade');
const chalk = require('chalk');
const { handleCreateCmd } = require('./commands/create/create.cmd');
const { deploy } = require('./commands/deploy/deploy.cmd');
const { build } = require('./commands/build/build.cmd');
const pkg = require('../package.json');

const prog = sade('campkit').version(pkg.version);

prog
  .command('create <microservice>')
  .describe('Create a new microservice with campkit')
  .example('create my-user-service')
  .action(async (pkg, opts) => {
    console.log(chalk.cyan(``));
    console.log(
      chalk.cyan(`  ⛺  Campkit - Build serverless Node.js microservices fast.`)
    );
    console.log(chalk.cyan(``));
    return await handleCreateCmd(pkg, opts);
  });

prog
  .command('build')
  .describe('Build the source directory. Expects an `index.js` entry file.')
  .option('-s, --source', 'source', 'src')
  .example('build --source src')
  .option('-d, --destination', 'destination', 'dist')
  .action(async (pkg, opts) => {
    return await build(pkg, opts);
  });

prog
  .command('deploy')
  .describe('deploy a new microservice with campkit')
  .option('-s, --stage', 'Change the stage to deploy to', 'dev')
  .example('deploy --stage dev')
  .example('deploy --stage prod')
  .option('-f, --force', 'Force the deploy', false)
  .example('deploy --force')
  .action(async (pkg, opts) => {
    return await deploy(pkg, opts);
  });

prog.parse(process.argv);
