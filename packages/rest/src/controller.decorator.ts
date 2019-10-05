import 'reflect-metadata';

const ControllerMetadata = Symbol('Controller');

export interface ControllerOptions {
  readonly name: string;
  readonly basePath?: string;
  readonly private?: boolean;
  readonly cors?: boolean;
}

export const Controller = (options: ControllerOptions): ClassDecorator => {
  console.log('----- Controller ------');
  console.log(options);

  return (target: any) => {
    console.log('----- Controller 2 ------');
    console.log(target);

    const prefix = options.name;
    Reflect.defineMetadata('prefix', prefix, target);

    // Since routes are set by our methods this should almost never be true (except the controller has no methods)
    if (!Reflect.hasMetadata('routes', target)) {
      Reflect.defineMetadata('routes', [], target);
    }
  };
};

export function getControllerMetadata(klass) {
  // return Reflect.getMetadata(ControllerMetadata, klass);
  return Reflect.getMetadata('routes', klass);
}
