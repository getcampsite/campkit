/**
 * External
 */
import { Logger } from '@campkit/common';

/**
 * Internal
 */
import {
  getControllerOptionsMetadata,
  ControllerOptions,
  getControllerRoutesMetadata,
} from './decorators';
import { RestRouter } from './router';

const logger = new Logger('class Controller');

export class Controller {
  private controller: any;

  constructor(controller: any) {
    if (!controller) {
      throw new Error('no controller to implement');
    }
    this.controller = controller;
  }

  public async onSuccess(res) {
    return await res;
  }

  public async onError(res) {
    return await res;
  }

  public run(requestOptions) {
    const { controller } = this;
    const routes = getControllerRoutesMetadata(controller);
    const controllerOptions = getControllerOptionsMetadata(controller);
    const routeRequested = this.handleControllerRoutes(
      controller,
      controllerOptions,
      routes,
      requestOptions
    );

    if (!routeRequested) {
      throw new Error('no route to implement');
    }

    return this.invokeRoute(routeRequested);
  }

  private handleControllerRoutes(
    controller: any,
    { basePath }: ControllerOptions,
    routes: any,
    httpRequest: any
  ) {
    const router = new RestRouter(httpRequest);
    routes.forEach(route => {
      router.addRoute({
        path: `[${route.method}]${basePath}${route.path}`,
        handler: options => {
          const ControllerInstance = new controller();
          const fn = route.handler.bind(ControllerInstance);
          return fn(options);
        },
      });
    });
    return router.find();
  }

  private invokeRoute(route: any) {
    const { handler, params, query, body, headers } = route;

    if (!handler) {
      throw new Error('no handler for route');
    }

    return handler({
      headers,
      params,
      query,
      body: this.parseBody(body),
    });
  }

  private parseBody(maybeJSON) {
    try {
      return JSON.parse(maybeJSON);
    } catch (e) {
      return {};
    }
  }
}
