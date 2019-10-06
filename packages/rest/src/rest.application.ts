/**
 * External
 */
import { Logger } from '@campkit/core';

/**
 * Internal
 */
import { getControllerMetadata } from './controller.decorator';

const logger = new Logger('RestApp');

export class RestApp {
  private controllers = [];
  constructor(options) {
    // logger.log(options);
    this.controllers = options.controllers;
  }
  run() {
    const { controllers } = this;

    if (controllers) {
      const routes = controllers.map((controller: any) => {
        const meta = getControllerMetadata(controller);
        // const con = new controller();
        logger.log(meta);
      });
      logger.log(routes);
    }

    // throw new Error('some err');

    return { RestApp: true };
  }

  static onSuccess(res) {
    return res;
  }

  static onError(res) {
    return res;
  }
}
