const { CampkitFactory } = require('@campkit/core');
const { _SERVICENAME_App } = require('./_servicename_.app');

async function handler(event, context) {
  return await CampkitFactory.create(_SERVICENAME_App, { event, context });
}

module.exports = {
  handler,
};
