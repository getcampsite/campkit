/**
 * External
 */
import { Logger } from '@campkit/common';

/**
 * Internal
 */
import { getEventControllerRoutesMetadata } from './decorators';

const logger = new Logger('event controller base');

export class Controller {
  private controller: any;

  constructor(controller: any) {
    if (!controller) {
      throw new Error('no controller to implement');
    }
    this.controller = controller;
  }

  public run(requestOptions) {
    logger.log(requestOptions, 'requestOptions');
    const { controller } = this;
    const routes = getEventControllerRoutesMetadata(controller);

    logger.log(routes, 'routes');

    const routeRequested = this.handleRouteRequested(
      controller,
      routes,
      requestOptions
    );

    if (!routeRequested) {
      throw new Error('no event route to implement');
    }

    logger.log(routeRequested, 'routeRequested');
    return routeRequested({ event: requestOptions });
  }

  private handleRouteRequested(
    controller: any,
    routes: any,
    incomingEvent: any
  ): null | Function {
    let selectedRoute = null;
    routes.forEach(route => {
      if (incomingEvent.triggerSource.indexOf(route.eventName) > -1) {
        // selected event handler
        const ControllerInstance = new route.methodFunction();
        const fn = route.handler.bind(ControllerInstance);
        selectedRoute = fn;
      }
    });
    return selectedRoute;
  }
}
