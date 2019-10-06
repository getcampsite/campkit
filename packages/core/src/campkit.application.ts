/**
 * Internal
 */
import { Logger } from './common';
import { getAppMetadata } from './app.decorator';

/**
 * Interfaces
 */

// interface Module {
//   run();
// }

const logger = new Logger('CampkitApplication');

export interface CampkitApplicationOptions {
  module: any;
}

export class CampkitApplication {
  private module: any;

  constructor(options: CampkitApplicationOptions) {
    this.module = options.module;
  }

  protected run(requestOptions: any) {
    const { module } = this;
    const appMetadata = getAppMetadata(module);

    const appClass = new module(appMetadata);
    const appOutput = appClass.run(requestOptions);

    if (!appOutput) {
      throw Error('no app output');
    }

    logger.log({ appClass, appMetadata });

    return appOutput;
  }

  protected handleResponse(response: any, isError: boolean = false) {
    const { module } = this;
    if (isError) {
      return module.onError(response);
    }
    return module.onSuccess(response);
  }
}
