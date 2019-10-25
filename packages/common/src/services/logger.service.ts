export class Logger {
  constructor(private readonly context?: string) {}

  log(message: any, message2?: any) {
    console.log(' ');
    console.log(`---- ${this.context} -----`);
    console.log(' ');
    console.log(message, message2 || '');
    console.log(' ');
  }
}
