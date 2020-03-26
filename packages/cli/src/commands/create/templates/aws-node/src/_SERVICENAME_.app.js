import { App } from '@campkit/core';
import { RestApp } from '@campkit/rest';
import { _SERVICENAME_Controller } from './_servicename_.controller';

@App({
  name: '_servicename_',
  controllers: [_SERVICENAME_Controller],
})
export class _SERVICENAME_App extends RestApp {
  constructor(options) {
    super(options);
  }
}
