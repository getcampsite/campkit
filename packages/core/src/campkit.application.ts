/**
 * External
 */
import { Logger } from '@campkit/common';
import { getRestControllerMetadata } from '@campkit/rest';
import { getEventControllerMetadata } from '@campkit/event';

/**
 * Internal
 */
import { getAppMetadata } from './decorators';
import { CampkitApplicationOptions } from './types';

const logger = new Logger('class CampkitApplication');

export interface CampkitApplicationOptions {
  module: any;
}
export class CampkitApplication {
  private appInstance: any;

  constructor(options: CampkitApplicationOptions) {
    this.appInstance = options.module;
  }

  /**
   * Note:
   *  Take an httpRequest and invokes a controller to handle it.
   *  It also calls the Controller Component to handle routes
   *
   * @param httpRequest
   */
  protected async runRestApplication(httpRequest: any) {
    const { appInstance } = this;
    const appInstanceMetadata = getAppMetadata(appInstance);

    if (!appInstanceMetadata.restController) {
      throw new Error('need a rest controller to handle http requests');
    }

    const RestController = appInstanceMetadata.restController;
    const RestControllerFactory = getRestControllerMetadata(RestController);
    const response = await RestControllerFactory.run(httpRequest);

    if (!response) {
      throw Error('Controller did not respond');
    }

    return response;
  }

  protected handleRestApplicationResponse(
    response: any,
    isError: boolean = false
  ) {
    const { appInstance } = this;
    const appInstanceMetadata = getAppMetadata(appInstance);
    const RestController = appInstanceMetadata.restController;
    const RestControllerFactory = getRestControllerMetadata(RestController);

    if (isError) {
      return RestController.onError // custom respond handler in user's controller
        ? RestController.onError(response)
        : RestControllerFactory.onError(response);
    }

    return RestController.onSuccess // custom respond handler in user's controller
      ? RestController.onSuccess(response)
      : RestControllerFactory.onSuccess(response);
  }

  protected async runEventApplication(event: any) {
    const { appInstance } = this;
    const appInstanceMetadata = getAppMetadata(appInstance);

    if (!appInstanceMetadata.eventController) {
      throw new Error('need a event controller to handle event requests');
    }

    const EventController = appInstanceMetadata.eventController;
    const EventControllerFactory = getEventControllerMetadata(EventController);
    const response = await EventControllerFactory.run(event);

    if (!response) {
      throw Error('Event controller did not respond');
    }

    return response;
  }
}
