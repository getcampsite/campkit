export class Logger {
  constructor(private readonly context?: string) {}

  log(message: any) {
    console.log(' ');
    console.log(`---- ${this.context} -----`);
    console.log(' ');
    console.log(message);
    console.log(' ');
  }
}
