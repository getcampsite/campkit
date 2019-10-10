#!/usr/bin/env node

const sade = require('sade');
const chalk = require('chalk');
const { handleCreateCmd } = require('./handleCreateCmd');
const pkg = require('../package.json');

const prog = sade('campkit');

prog
  .version(pkg.version)
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

prog.parse(process.argv);
