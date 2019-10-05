import 'reflect-metadata';

export interface LambdaOptions {
  name?: string;
  path?: string;
  method?: string;
  integration?: string; // TODO Enum with all possible values of serverless integration;
  private?: boolean;
  cors?: boolean;
  authorizer?: string | {};
  description?: string;
}

export interface RouteDefinition {
  routeName: string;

  // Path to our route
  path: string;

  // HTTP Request method (get, post, ...)
  requestMethod: 'get' | 'post' | 'delete' | 'options' | 'put';

  // Method name within our class responsible for this route
  methodName: string;
}

export const Get = (options: LambdaOptions) => {
  return (target: any, propertyKey: string): void => {
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
      routeName: options.name || '',
      requestMethod: 'get',
      path: options.path || '',
      methodName: propertyKey,
    });
    Reflect.defineMetadata('routes', routes, target.constructor);
  };
};
