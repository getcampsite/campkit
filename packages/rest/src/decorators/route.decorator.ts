import { HttpMethod } from '@campkit/common';

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
export interface RouteDefinition {
  path: string; // Path to our route
  handler: any;
  methodFunction: any;
  method: HttpMethod;
}

interface RequestMappingMetadata {
  // path?: string | string[];
  path?: string;
  method?: HttpMethod;
}

const PATH_METADATA = 'path';
const METHOD_METADATA = 'method';

function RequestMapping(metadata: RequestMappingMetadata): MethodDecorator {
  const pathMetadata = metadata[PATH_METADATA];
  const path = pathMetadata && pathMetadata.length ? pathMetadata : '/';
  const requestMethod = metadata[METHOD_METADATA] || HttpMethod.GET;

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

const createMappingDecorator = (method: HttpMethod) => (
  options: RouteOptions
): MethodDecorator => {
  return RequestMapping({
    [PATH_METADATA]: options.path,
    [METHOD_METADATA]: method,
  });
};

export const Get = createMappingDecorator(HttpMethod.GET);
export const Post = createMappingDecorator(HttpMethod.POST);
export const Delete = createMappingDecorator(HttpMethod.DELETE);
export const Put = createMappingDecorator(HttpMethod.PUT);
export const Patch = createMappingDecorator(HttpMethod.PATCH);
export const Options = createMappingDecorator(HttpMethod.OPTIONS);
export const Head = createMappingDecorator(HttpMethod.HEAD);
export const All = createMappingDecorator(HttpMethod.ALL);
