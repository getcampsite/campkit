/***
 * External
 */
import { Logger } from '@campkit/common';

/**
 * Internal
 */
import { Controller } from '../event.controller.component';

const logger = new Logger('@EventController');

/**
 * Interface defining options that can be passed to `@Controller()` decorator
 *
 * readonly name: string;
 *
 */
interface EventControllerOptions {
  readonly basePath?: string;
}

export function EventController(
  options: EventControllerOptions
): ClassDecorator {
  return (target: any) => {
    logger.log({ options, target });

    // Associate our "private" Controller Class to the user's Controller metadata
    // The campkit application will use this to invoke route logic
    const controllerFactory = new Controller(target);
    Reflect.defineMetadata('event.controller', controllerFactory, target);

    // Since routes are set by our methods this should almost never be true
    // (except the controller has no methods)
    if (!Reflect.hasMetadata('event.controller.routes', target)) {
      Reflect.defineMetadata('event.controller.routes', [], target);
    }
  };
}

export function getEventControllerMetadata(controllerClass) {
  return Reflect.getMetadata('event.controller', controllerClass);
}
