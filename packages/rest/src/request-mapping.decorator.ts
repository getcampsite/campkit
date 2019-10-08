import { RequestMethod } from '@campkit/core';

/**
 * @todo: implement
  name?: string;
  description?: string;
  integration?: string; // TODO Enum with all possible values of serverless integration;
  private?: boolean;
  cors?: boolean;
  authorizer?: string | {};
 */
export interface RouteOptions {
  path: string;
}

// export interface RouteDefinition {
//   path: string; // Path to our route
//   method: 'get' | 'post' | 'delete' | 'options' | 'put';
//   methodName: string; // Method name within our class responsible for this route
//   methodFunction: any;
// }

export interface RouteDefinition {
  path: string; // Path to our route
  handler: any;
  methodFunction: any;
  method: RequestMethod;
}

interface RequestMappingMetadata {
  // path?: string | string[];
  path?: string;
  method?: RequestMethod;
}

const PATH_METADATA = 'path';
const METHOD_METADATA = 'method';

function RequestMapping(metadata: RequestMappingMetadata): MethodDecorator {
  const pathMetadata = metadata[PATH_METADATA];
  const path = pathMetadata && pathMetadata.length ? pathMetadata : '/';
  const requestMethod = metadata[METHOD_METADATA] || RequestMethod.GET;

  return (target, key, descriptor: PropertyDescriptor) => {
    // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
    // To prevent any further validation simply set it to an empty array here.
    if (!Reflect.hasMetadata('routes', target.constructor)) {
      Reflect.defineMetadata('routes', [], target.constructor);
    }

    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes = Reflect.getMetadata('routes', target.constructor) as Array<
      RouteDefinition
    >;

    routes.push({
      path,
      method: requestMethod,
      handler: descriptor.value,
      methodFunction: target.constructor,
    });

    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, requestMethod, descriptor.value);
    Reflect.defineMetadata('routes', routes, target.constructor);
    return descriptor;
  };
}

const createMappingDecorator = (method: RequestMethod) => (
  options: RouteOptions
): MethodDecorator => {
  return RequestMapping({
    [PATH_METADATA]: options.path,
    [METHOD_METADATA]: method,
  });
};

export const Get = createMappingDecorator(RequestMethod.GET);
export const Post = createMappingDecorator(RequestMethod.POST);
export const Delete = createMappingDecorator(RequestMethod.DELETE);
export const Put = createMappingDecorator(RequestMethod.PUT);
export const Patch = createMappingDecorator(RequestMethod.PATCH);
export const Options = createMappingDecorator(RequestMethod.OPTIONS);
export const Head = createMappingDecorator(RequestMethod.HEAD);
export const All = createMappingDecorator(RequestMethod.ALL);

// export const _Get = (options: RouteOptions) => {
//   return (target: any, propertyKey: string): void => {
//     console.log('----Get');
//     console.log(target, propertyKey);

//     // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
//     // To prevent any further validation simply set it to an empty array here.
//     if (!Reflect.hasMetadata('routes', target.constructor)) {
//       Reflect.defineMetadata('routes', [], target.constructor);
//     }

//     // Get the routes stored so far, extend it by the new route and re-set the metadata.
//     const routes = Reflect.getMetadata('routes', target.constructor) as Array<
//       RouteDefinition
//     >;

//     routes.push({
//       path: options.path,
//       method: 'get',
//       methodName: propertyKey,
//       methodFunction: target.constructor,
//     });
//     Reflect.defineMetadata('routes', routes, target.constructor);
//   };
// };
