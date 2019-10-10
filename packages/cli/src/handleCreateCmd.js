const chalk = require('chalk');
const { Input, Select } = require('enquirer');
const fs = require('fs-extra');
const path = require('path');
const replace = require('replace-in-file');
const execa = require('execa');

const {
  capitalizeFirstLetter,
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

  await installServiceDeps(servicePath, serviceName);

  triggerSuccessMsg(servicePath, serviceName);

  return true;
}

async function moveServiceTemplateToUserDir(servicePath, templateName) {
  return fs.copy(
    path.resolve(__dirname, `../templates/${templateName}`),
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
    to: [capitalizeFirstLetter(serviceName), serviceName],
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
    .filter(function(file) {
      return file.match(match);
    })
    .forEach(function(file) {
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
      result: v => v.trim(),
    });
    pkg = await prompt.run();
    projectPath = fs.realpathSync(process.cwd()) + '/' + pkg;
    return getProjectPath(projectPath); // recursion!
  } else {
    return projectPath;
  }
}

async function installServiceDeps(pathToService, serviceName) {
  // fix gitignore
  await fs.move(
    path.resolve(pathToService, './gitignore'),
    path.resolve(pathToService, './.gitignore')
  );

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

  let depsDev = [
    'serverless',
    'serverless-campkit',
    'serverless-offline',
    'serverless-webpack',
    'webpack',
    'aws-sdk',
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
