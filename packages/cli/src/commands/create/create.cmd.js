const chalk = require('chalk');
const { Input, Select } = require('enquirer');
const fs = require('fs-extra');
const path = require('path');
const replace = require('replace-in-file');
const execa = require('execa');

const {
  capitalizeFirstLetter,
  makeCodeSafe,
  safePackageName,
  getInstallCmd,
  getInstallArgs,
  getDevInstallArgs,
} = require('./utils');

async function handleCreateCmd(pkg, options) {
  let template;
  const prompt = new Select({
    message: 'Choose a template',
    choices: ['aws node', 'aws node typescript'],
  });

  try {
    // get the project path
    let projectPath = await getProjectPath(
      fs.realpathSync(process.cwd()) + '/' + pkg,
      pkg
    );

    if (options.template) {
      template = options.template.trim();
      if (!prompt.choices.includes(template)) {
        template = await prompt.run();
      }
    } else {
      template = await prompt.run();
    }

    template = template.split(' ').join('-');

    return handleTemplateCreation(template, projectPath, pkg);
  } catch (error) {
    console.log(error);
    template = await prompt.run();
  }
}

async function handleTemplateCreation(templateName, servicePath, serviceName) {
  await moveServiceTemplateToUserDir(servicePath, templateName);

  await renameServiceNameInFiles(servicePath, serviceName);

  await renameServiceTemplateFiles(servicePath, serviceName);

  await installServiceDeps(servicePath, serviceName, templateName);

  triggerSuccessMsg(servicePath, serviceName);

  return true;
}

async function moveServiceTemplateToUserDir(servicePath, templateName) {
  return fs.copy(
    path.resolve(__dirname, `./templates/${templateName}`),
    servicePath,
    {
      overwrite: true,
    }
  );
}

async function renameServiceNameInFiles(pathToService, serviceName) {
  const options = {
    // files: `${pathToService}/src/*.js`,
    files: `${pathToService}/**`,
    from: [/_SERVICENAME_/g, /_servicename_/g],
    to: [makeCodeSafe(capitalizeFirstLetter(serviceName)), serviceName],
  };
  return replace(options);
}

async function renameServiceTemplateFiles(pathToService, serviceName) {
  pathToService = `${pathToService}/src`;

  let files;
  const match = RegExp('_SERVICENAME_', 'g');
  const replace = serviceName;

  files = fs.readdirSync(pathToService);
  files
    .filter(function (file) {
      return file.match(match);
    })
    .forEach(function (file) {
      const filePath = path.join(pathToService, file);
      const newFilePath = path.join(
        pathToService,
        file.replace(match, replace)
      );
      fs.renameSync(filePath, newFilePath);
    });
}

async function getProjectPath(projectPath, pkg) {
  if (fs.existsSync(projectPath)) {
    const prompt = new Input({
      message: `A folder named ${chalk.bold.red(
        pkg
      )} already exists! ${chalk.bold('Choose a different name')}`,
      initial: pkg + '-1',
      result: (v) => v.trim(),
    });
    pkg = await prompt.run();
    projectPath = fs.realpathSync(process.cwd()) + '/' + pkg;
    return getProjectPath(projectPath); // recursion!
  } else {
    return projectPath;
  }
}

async function installServiceDeps(pathToService, serviceName, templateName) {
  // fix gitignore
  await fs.move(
    path.resolve(pathToService, './gitignore'),
    path.resolve(pathToService, './.gitignore')
  );

  // fix babelrc
  if (path.resolve(pathToService, './babelrc')) {
    await fs.move(
      path.resolve(pathToService, './babelrc'),
      path.resolve(pathToService, './.babelrc')
    );
  }

  // Install deps
  process.chdir(pathToService);

  const safeName = safePackageName(serviceName);
  const pkgJson = {
    name: safeName,
    version: '1.0.0',
    main: 'dist/index.js',
    scripts: {
      dev: 'NODE_ENV=development sls offline',
      'deploy:prod': 'NODE_ENV=production STAGE=prod sls deploy',
      'deploy:dev': 'NODE_ENV=development STAGE=dev sls deploy',
      test: 'echo "Error: no test specified" && exit 0',
    },
    dependencies: {},
    prettier: {
      printWidth: 80,
      singleQuote: true,
    },
  };

  await fs.outputJSON(path.resolve(pathToService, 'package.json'), pkgJson);

  switch (templateName) {
    case 'aws-node':
      return installNodeDeps();
    case 'aws-node-typescript':
      return installTypeScriptDeps();
  }
}

async function installNodeDeps() {
  let depsDev = [
    'serverless@1.54.0',
    'serverless-campkit',
    'serverless-offline@5.12.0',
    'serverless-webpack@5.3.1',
    'webpack@4.41.0',
    'babel-loader@8.0.6',
    '@babel/core@7.6.3',
    '@babel/preset-env@7.6.3',
    '@babel/plugin-proposal-decorators@7.6.0',
    '@babel/plugin-proposal-class-properties@7.5.5',
  ].sort();

  let deps = ['@campkit/core', '@campkit/rest'].sort();

  const cmd = getInstallCmd();

  console.log(' ');
  console.log(chalk.cyan(`...installing dependencies`));
  console.log(' ');

  await execa(cmd, getDevInstallArgs(cmd, depsDev));
  await execa(cmd, getInstallArgs(cmd, deps));

  return true;
}

async function installTypeScriptDeps() {
  let depsDev = [
    'serverless@1.54.0',
    'serverless-campkit',
    'serverless-offline@5.12.0',
    'serverless-webpack@5.3.1',
    'webpack@4.41.0',
    'ts-loader@6.2.0',
    'typescript@3.6.3',
    'aws-sdk',
    '@types/aws-lambda@8.10.33',
    '@types/node@10.12.18',
  ].sort();

  let deps = ['@campkit/core', '@campkit/rest'].sort();

  const cmd = getInstallCmd();

  console.log(' ');
  console.log(chalk.cyan(`...installing dependencies`));
  console.log(' ');

  await execa(cmd, getDevInstallArgs(cmd, depsDev));
  await execa(cmd, getInstallArgs(cmd, deps));

  return true;
}

function triggerSuccessMsg() {
  console.log(chalk.green(`success`));
  console.log(' ');
}

module.exports = {
  handleCreateCmd,
};
