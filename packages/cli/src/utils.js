const execa = require('execa');

let cmd;

function getInstallCmd() {
  if (cmd) {
    return cmd;
  }

  try {
    execa.sync('yarnpkg', ['--version']);
    cmd = 'yarn';
  } catch (e) {
    cmd = 'npm';
  }

  return cmd;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function safePackageName(name) {
  return name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '');
}

function getDevInstallArgs(cmd, packages) {
  switch (cmd) {
    case 'npm':
      return ['install', ...packages, '--save-dev'];
    case 'yarn':
      return ['add', ...packages, '--dev'];
  }
}

function getInstallArgs(cmd, packages) {
  switch (cmd) {
    case 'npm':
      return ['install', ...packages, '--save'];
    case 'yarn':
      return ['add', ...packages];
  }
}

module.exports = {
  getInstallCmd,
  getInstallArgs,
  getDevInstallArgs,
  capitalizeFirstLetter,
  safePackageName,
};
