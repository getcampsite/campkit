/***
 * External
 */
import { Logger } from '@campkit/common';

export interface RouteDefinition {
  eventName: string;
  handler: any;
  methodFunction: any;
}

const logger = new Logger('@Event');

export function Event(eventName: string): MethodDecorator {
  // const pathMetadata = metadata[PATH_METADATA];
  // const path = pathMetadata && pathMetadata.length ? pathMetadata : '/';
  // const requestMethod = metadata[METHOD_METADATA] || HttpMethod.GET;

  logger.log(eventName, 'eventName');

  return (target, key, descriptor: PropertyDescriptor) => {
    // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
    // To prevent any further validation simply set it to an empty array here.

    if (!Reflect.hasMetadata('event.controller.routes', target.constructor)) {
      Reflect.defineMetadata('event.controller.routes', [], target.constructor);
    }

    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes = Reflect.getMetadata(
      'event.controller.routes',
      target.constructor
    ) as Array<RouteDefinition>;
    routes.push({
      eventName,
      handler: descriptor.value,
      methodFunction: target.constructor,
    });
    // Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    // Reflect.defineMetadata(METHOD_METADATA, requestMethod, descriptor.value);
    Reflect.defineMetadata(
      'event.controller.routes',
      routes,
      target.constructor
    );
    return descriptor;
  };
}

export function getEventControllerRoutesMetadata(controllerClass) {
  return Reflect.getMetadata('event.controller.routes', controllerClass);
}
