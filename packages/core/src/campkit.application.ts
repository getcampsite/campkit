/**
 * Internal
 */
import { getAppMetadata } from './app.decorator';

/**
 * Interfaces
 */
interface GenericObject {
  [key: string]: any;
}

// 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head';
interface HttpRequest {
  method: string;
  path: string;
  headers: GenericObject;
  body: GenericObject; // null | json.stringify | {}
}

export interface CampkitHTTPRequest extends HttpRequest {}

export interface CampkitApplicationOptions {
  module: any;
}

export class CampkitApplication {
  private appInstance: any;

  constructor(options: CampkitApplicationOptions) {
    this.appInstance = options.module;
  }

  protected async run(requestOptions: any) {
    const { appInstance } = this;
    const appInstanceMetadata = getAppMetadata(appInstance);
    const appClass = new appInstance(appInstanceMetadata);
    const appOutput = await appClass.run(requestOptions);

    if (!appOutput) {
      throw Error('no app output');
    }

    return appOutput;
  }

  protected handleResponse(response: any, isError: boolean = false) {
    const { appInstance } = this;
    if (isError) {
      return appInstance.onError(response);
    }
    return appInstance.onSuccess(response);
  }
}
