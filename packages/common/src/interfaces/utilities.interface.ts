export interface GenericObject {
  [key: string]: any;
}

export const debug = (...debugArgs: any): MethodDecorator => {
  return function(target, name, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    descriptor.value = function(...args: any) {
      console.log(debugArgs);
      console.log(`Calling ${String(name)} with arguments: %o`, args);
      let result = method.apply(this, args);
      console.log(`result is %o`, result);
      return result;
    };
  };
};
