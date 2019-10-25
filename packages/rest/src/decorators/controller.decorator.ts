/***
 * External
 */
import { Logger } from '@campkit/common';

/**
 * Internal
 */
import { Controller } from '../controller.component';

const logger = new Logger('@RestController');

/**
 * Interface defining options that can be passed to `@Controller()` decorator
 *
 * readonly name: string;
 *
 */
export interface ControllerOptions {
  readonly basePath?: string;
  readonly authorizer?: any;
}

/**
 * Decorator that marks a class as a controller that can receive inbound
 * requests and produce responses.
 *
 **/
export function RestController(options: ControllerOptions): ClassDecorator {
  return (target: any) => {
    // logger.log({ options, target });

    Reflect.defineMetadata(
      'routes.basePath',
      { basePath: options.basePath },
      target
    );

    // Associate our "private" Controller Class to the user's Controller metadata
    // The campkit application will use this to invoke route logic
    const controllerFactory = new Controller(target);
    Reflect.defineMetadata('rest.controller', controllerFactory, target);

    // Since routes are set by our methods this should almost never be true
    // (except the controller has no methods)
    if (!Reflect.hasMetadata('routes', target)) {
      Reflect.defineMetadata('routes', [], target);
    }
  };
}

export function getControllerRoutesMetadata(controllerClass: any) {
  return Reflect.getMetadata('routes', controllerClass);
}

export function getControllerOptionsMetadata(controllerClass) {
  return Reflect.getMetadata('routes.basePath', controllerClass);
}

export function getControllerMetadata(klass) {
  // return Reflect.getMetadata(ControllerMetadata, klass);
  return Reflect.getMetadata('routes', klass);
}

export function getRestControllerMetadata(controllerClass) {
  return Reflect.getMetadata('rest.controller', controllerClass);
}
