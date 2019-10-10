const { App } = require('@campkit/core');
const { RestApp } = require('@campkit/rest');
const { _SERVICENAME_Controller } = require('./_servicename_.controller');

@App({
  name: '_servicename_',
  controllers: [_SERVICENAME_Controller],
})
class _SERVICENAME_App extends RestApp {
  constructor(options) {
    super(options);
  }
}

module.exports = {
  _SERVICENAME_App,
};
