const path = require('path');
const fs = require('fs-extra');

const appDirectory = fs.realpathSync(process.cwd());

function resolvePath(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  root: resolvePath('./'),
  resolve: (path) => resolvePath(path),
};
