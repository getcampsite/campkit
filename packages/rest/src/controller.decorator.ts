import 'reflect-metadata';
import { Logger } from '@campkit/core';

const PATH_METADATA = 'path';
export const SCOPE_OPTIONS_METADATA = 'scope:options';

const logger = new Logger('@Controller');

const ControllerMetadata = Symbol('Controller');

/**
 * Interface defining options that can be passed to `@Controller()` decorator
 *
 * @publicApi
 */
export interface ControllerOptions {
  readonly name: string;
  readonly basePath?: string;
  readonly private?: boolean;
  readonly cors?: boolean;
}

/**
 * Decorator that marks a class as a Nest controller that can receive inbound
 * requests and produce responses.
 *
 **/

export function Controller(options: ControllerOptions): ClassDecorator {
  // return (target: object) => {
  //   Reflect.defineMetadata(PATH_METADATA, path, target);
  //   Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, scopeOptions, target);
  // };

  return (target: any) => {
    logger.log({ options, target });

    const prefix = options.name;
    Reflect.defineMetadata('prefix', prefix, target);

    // Since routes are set by our methods this should almost never be true (except the controller has no methods)
    if (!Reflect.hasMetadata('routes', target)) {
      Reflect.defineMetadata('routes', [], target);
    }
  };
}

export function getControllerMetadata(klass) {
  // return Reflect.getMetadata(ControllerMetadata, klass);
  return Reflect.getMetadata('routes', klass);
}
