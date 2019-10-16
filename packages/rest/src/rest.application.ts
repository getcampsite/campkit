/**
 * External
 */
import { Logger } from '@campkit/core';

/**
 * Internal
 */
import {
  getControllerOptionsMetadata,
  ControllerOptions,
  getControllerRoutesMetadata,
} from './controller.decorator';
import { RestRouter } from './router';

export class RestApp {
  private controllers = [];

  static async onSuccess(res) {
    return await res;
  }

  static async onError(res) {
    return await res;
  }

  constructor(options) {
    this.controllers = options.controllers;
  }

  run(requestOptions) {
    const { controllers } = this;

    if (!controllers) {
      throw new Error('no controllers implemented');
    }

    const routeRequested = controllers.map((controller: any) => {
      const routes = getControllerRoutesMetadata(controller);
      const controllerOptions = getControllerOptionsMetadata(controller);
      return this.handleControllerRoutes(
        controller,
        controllerOptions,
        routes,
        requestOptions
      );
    });

    if (!routeRequested || !routeRequested.length) {
      throw new Error('no route implemented');
    }

    return this.invokeRoute(routeRequested[0]);
  }

  handleControllerRoutes(
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
          const controllerInstance = new controller();
          const fn = route.handler.bind(controllerInstance);
          return fn(options);
        },
      });
    });
    return router.find();
  }

  private invokeRoute(route: any) {
    const { handler, params, query, body } = route;

    if (!handler) {
      throw new Error('no handler for route');
    }

    return handler({ params, query, body: this.parseBody(body) });
  }

  private parseBody(maybeJSON) {
    try {
      return JSON.parse(maybeJSON);
    } catch (e) {
      return {};
    }
  }
}
