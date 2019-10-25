const path = require('path');
const rimraf = require('rimraf');

// del root node_modules
rimraf.sync(path.resolve(__dirname, `../node_modules`));

// del dirs of interest in all packages
[
  'authentication',
  'cli',
  'common',
  'core',
  'rest',
  'serverless-campkit',
].forEach(packageName => {
  rimraf.sync(path.resolve(__dirname, `../packages/${packageName}/dist`));
  rimraf.sync(
    path.resolve(__dirname, `../packages/${packageName}/.rts2_cache_cjs`)
  );
  rimraf.sync(
    path.resolve(__dirname, `../packages/${packageName}/.rts2_cache_esm`)
  );
  rimraf.sync(
    path.resolve(__dirname, `../packages/${packageName}/node_modules`)
  );
});
