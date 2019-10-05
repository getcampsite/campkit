import { getControllerMetadata, RouteDefinition } from '@campkit/rest';

function debug(msg: string, a?: any) {
  console.log('--------');
  console.log(msg);
  a ? console.log(a) : '';
  console.log(' ');
}

export class ServerlessPlugin {
  private servicePath?: string;
  private entrypoint?: string;
  private serviceName?: string;
  private buildFolder?: string;

  private options: any;
  private serverless: any;

  public hooks: any = {};

  /**
   *
   * @param serverless
   * @param options
   */
  constructor(serverless: any, options: any = {}) {
    this.serverless = serverless;
    this.options = options;

    debug('constructor');

    this.hooks = {
      'before:package:initialize': () => {
        debug('before:package:initialize');
        // return this.configureFunctions();
        return this.initOfflineHook();
      },

      'before:invoke:local:invoke': () => {
        debug('before:invoke:local:invoke');
        // return this.configureFunctions();
        return this.initOfflineHook();
      },

      'before:offline:start:init': () => {
        debug('before:offline:start:init');
        return this.initOfflineHook();
      },

      'before:offline:start': () => {
        debug('before:offline:start');
        return this.initOfflineHook();
      },

      // adding hook to make it work with serverless-offline plugin
      // 'offline:start:init': () => {
      //   debug('offline:start:init');
      //   return this.configureFunctions();
      // },

      // adding hook to fix aws:info:display
      'before:info:info': () => {
        debug('before:info:info');
        // return this.configureFunctions();
        return this.initOfflineHook();
      },
    };

    // const customOptions = serverless.service.custom;

    // debug('customOptions', customOptions);

    // this.servicePath = serverless.config.servicePath;
    // debug('servicePath:', this.servicePath);

    // this.buildFolder = customOptions.buildFolder;
    // debug('build folder', this.buildFolder);

    // const awsService = serverless.service.service;
    // this.serviceName = awsService;
    // debug('awsService name', awsService);
    // debug('stage', this.options.stage);

    // if (!serverless.service.custom.entrypoint) {
    //   // throw new Error('you shall provide path to your entrypoint');
    // }

    // this.entrypoint = serverless.service.custom.entrypoint;
    // debug('entrypoint', this.entrypoint);
  }

  initOfflineHook() {
    // debug('initOfflineHook', this.serverless.service.custom);

    const customOptions = this.serverless.service.custom;

    debug('customOptions', customOptions);

    this.servicePath = ((): string => {
      return this.serverless.config.servicePath;
    })();
    debug('servicePath:', this.servicePath);

    this.buildFolder = customOptions.buildFolder;
    debug('build folder', this.buildFolder);

    const awsService = this.serverless.service.service;
    this.serviceName = awsService;
    debug('awsService name', awsService);
    debug('stage', this.options.stage);

    if (!this.serverless.service.custom.entrypoint) {
      throw new Error('you shall provide path to your entrypoint');
    }

    this.entrypoint = this.serverless.service.custom.entrypoint;
    debug('entrypoint', this.entrypoint);

    return this.configureFunctions();
  }

  /** */

  public async configureFunctions() {
    debug('importing module');

    // const module = require(`${this.servicePath}/${this.entrypoint}`);
    const modulePath = `${this.servicePath}/${this.entrypoint}`;

    debug('modulePath', modulePath);

    const module = await this.importModule(modulePath);

    this.serverless.cli.log('Injecting configuration');
    debug('works', module);

    // const service = module.default.TenantService;
    const service = module.default.handler();
    debug('service metadata', Reflect.getMetadataKeys(service));

    const routes = getControllerMetadata(service);

    debug('endpoints', routes);

    if (!routes) {
      debug('no endpoints');
      return;
    }

    for (const route of routes) {
      debug('configuring endpoint', route);
      this.addFunctionToService(route);
      debug('functions is');
      debug(this.serverless.service.functions[route.methodName]);
      debug(this.serverless.service.functions[route.methodName].events);
    }

    this.serverless.cli.log(`${routes.length} route configured`);
  }

  /**
   *
   * @param path
   */
  public async importModule(path: string) {
    return import(path);
    // return require.resolve(path);
  }

  /**
   create:
    name: ${self:custom.service.prefix}-${self:custom.stage}-${self:custom.service.name.singular}-create
    description: create an entity
    handler: src/index.create
    timeout: 20 # in seconds, default is 6
    memorySize: 1024 # in MB, default is 1024
    events:
      - http:
          path: /
          method: post
          cors: true
  */
  public addFunctionToService(route: RouteDefinition) {
    const { path, routeName, requestMethod, methodName } = route;
    const functionName = methodName;

    this.serverless.service.functions[methodName] = {
      name: routeName,
      // handler: `${this.entrypoint}.${functionName}`,
      handler: `./main.handler`,
      timeout: 20,
      memorySize: 1024,
      events: [
        {
          http: {
            path: path,
            method: requestMethod,
            // integration: 'lambda',
            cors: true,
          },
        },
      ],
    };
  }

  /**
   *
   * @param endpoint
   * @param lambda
   * @param forDeployment
   */
  // public addFunctionToService(
  //   endpoint: EndpointOptions,
  //   lambda: LambdaOptions,
  //   forDeployment = false
  // ) {
  //   const functionName = lambda.name;

  //   const basePath = endpoint.basePath || '';

  //   const fullFunctionName = `${this.serviceName}-${this.options.stage ||
  //     ''}-${functionName}`;

  //   // cors true by default
  //   let corsOption: any = true;

  //   if (lambda.hasOwnProperty('cors')) {
  //     corsOption = lambda.cors;
  //   } else if (endpoint.hasOwnProperty('cors')) {
  //     corsOption = endpoint.cors;
  //   }

  //   const privateLambda = lambda.hasOwnProperty('private')
  //     ? !!lambda.private
  //     : !!endpoint.private;

  //   let entrypoint = this.entrypoint;
  //   const path = basePath + lambda.path;
  //   const method = lambda.method;
  //   const authorizer = lambda.hasOwnProperty('authorizer')
  //     ? lambda.authorizer
  //     : null;

  //   const httpEvent: LambdaOptions & { integration: string } = {
  //     integration: lambda.integration || 'lambda',
  //     cors: corsOption,
  //     private: privateLambda,
  //   };

  //   if (lambda.path) {
  //     httpEvent.path = path;
  //   }

  //   if (method) {
  //     httpEvent.method = method;
  //   }

  //   if (authorizer) {
  //     httpEvent.authorizer = authorizer;
  //   }

  //   if (forDeployment) {
  //     entrypoint = entrypoint
  //       .split('/')
  //       .filter(pathPart => {
  //         return pathPart !== '..';
  //       })
  //       .join('/');
  //   }

  //   const lambdaDef: any = {
  //     name: fullFunctionName,
  //     handler: `${entrypoint}.${functionName}`,
  //   };

  //   if (lambda.path) {
  //     lambdaDef['events'] = [
  //       {
  //         http: httpEvent,
  //       },
  //     ];
  //   } else {
  //     lambdaDef['events'] = [];
  //   }

  //   this.serverless.service.functions[lambda.name || ''] = lambdaDef;

  //   debug(
  //     'function configured',
  //     this.serverless.service.functions[lambda.name || '']
  //   );
  // }
}
