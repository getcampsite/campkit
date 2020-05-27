const LOG_LEVELS = {
  VERBOSE: 1,
  DEBUG: 2,
  INFO: 3,
  WARN: 4,
  ERROR: 5,
};

// type LOG_LEVELS = {
//   VERBOSE: 1,
//   DEBUG: 2,
//   INFO: 3,
//   WARN: 4,
//   ERROR: 5
// }

// function prop<T, K extends keyof T>(obj: T, key: K) {
//   return obj[key];
// }

// const level = prop(LOG_LEVELS, '')

export class Logger {
  private readonly context: string;
  private readonly level: string;

  constructor(context = '', level = 'WARN') {
    this.context = context;
    this.level = process.env.LOG_LEVEL || level;
  }

  _padding(n: number) {
    return n < 10 ? '0' + n : '' + n;
  }

  _ts() {
    const dt = new Date();
    return (
      [this._padding(dt.getMinutes()), this._padding(dt.getSeconds())].join(
        ':'
      ) +
      '.' +
      dt.getMilliseconds()
    );
  }

  private _log(type: string, ...msg: any[]) {
    let loggerLevelName = this.level;
    const loggerLevel = (LOG_LEVELS as any)[loggerLevelName] as number;
    const typeLevel = (LOG_LEVELS as any)[type];

    if (!(typeLevel >= loggerLevel)) {
      // Do nothing if type is not greater than or equal to logger level (handle undefined)
      return;
    }

    let log = console.log.bind(console);
    if (type === 'ERROR' && console.error) {
      log = console.error.bind(console);
    }
    if (type === 'WARN' && console.warn) {
      log = console.warn.bind(console);
    }

    const prefix = `[${type}] ${this._ts()} ${this.context}`;

    if (msg.length === 1 && typeof msg[0] === 'string') {
      log(`${prefix} - ${msg[0]}`);
    } else if (msg.length === 1) {
      log(prefix, msg[0]);
    } else if (typeof msg[0] === 'string') {
      let obj = msg.slice(1);
      if (obj.length === 1) {
        obj = obj[0];
      }
      log(`${prefix} - ${msg[0]}`, obj);
    } else {
      log(prefix, msg);
    }
  }

  log(...msg: any[]) {
    this._log('INFO', ...msg);
  }

  info(...msg: any[]) {
    this._log('INFO', ...msg);
  }

  warn(...msg: any[]) {
    this._log('WARN', ...msg);
  }

  error(...msg: any[]) {
    this._log('ERROR', ...msg);
  }

  debug(...msg: any[]) {
    this._log('DEBUG', ...msg);
  }

  verbose(...msg: any[]) {
    this._log('VERBOSE', ...msg);
  }
}
