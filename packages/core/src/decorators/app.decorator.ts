export interface AppOptions {
  name: string;
  restController?: any;
  eventController?: any;
}

export function App(options: AppOptions): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata('app', options, target);
  };
}

export function getAppMetadata(klass: any) {
  return Reflect.getMetadata('app', klass);
}
