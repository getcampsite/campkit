import { Logger } from './common';

// export interface Controller {}

const logger = new Logger('@App()');

export interface AppOptions {
  name: string;
  controllers: any[];
  onSuccess?(): any;
  onError?(): any;
}

export function App(options: AppOptions): ClassDecorator {
  return (target: object) => {
    logger.log({ options, target });

    // const appName = options.name;

    Reflect.defineMetadata('app', options, target);
    // Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, scopeOptions, target);
  };
}

export function getAppMetadata(klass: any) {
  return Reflect.getMetadata('app', klass);
}
