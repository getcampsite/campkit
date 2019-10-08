import 'reflect-metadata';
import { Logger } from '@campkit/core';

const PATH_METADATA = 'path';
export const SCOPE_OPTIONS_METADATA = 'scope:options';

const logger = new Logger('@Controller');

const ControllerMetadata = Symbol('Controller');

/**
 * Interface defining options that can be passed to `@Controller()` decorator
 *
 * readonly name: string;
 *
 */
export interface ControllerOptions {
  readonly basePath?: string;
}

/**
 * Decorator that marks a class as a Nest controller that can receive inbound
 * requests and produce responses.
 *
 **/

export function Controller(options: ControllerOptions): ClassDecorator {
  const path = options.basePath;
  const scopeOptions = 'scopeOptions';

  // return (target: object) => {
  //   logger.log({ options, path, target });
  //   Reflect.defineMetadata(PATH_METADATA, path, target);
  //   Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, scopeOptions, target);
  // };

  return (target: any) => {
    // logger.log({ options, target });

    // const prefix = options.name;
    // Reflect.defineMetadata('prefix', prefix, target);
    Reflect.defineMetadata(
      'routes.basePath',
      { basePath: options.basePath },
      target
    );

    // Since routes are set by our methods this should almost never be true (except the controller has no methods)
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
