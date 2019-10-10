const path = require('path');
const execSync = require('child_process').execSync;

function exec(cmd) {
  execSync(cmd, { stdio: 'inherit', env: process.env });
}

const cwd = process.cwd();

['cli', 'core', 'rest', 'serverless-campkit'].forEach(packageName => {
  process.chdir(path.resolve(__dirname, '../packages/' + packageName));
  exec('yarn test');
});

process.chdir(cwd);
