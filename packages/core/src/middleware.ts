/**
 * External
 */
import { Logger } from '@campkit/common';

/**
 * Interfaces
 */
export type BeforeMiddleware = (invocation: any) => Promise<any>;
export type AfterMiddleware = (invocation: any) => Promise<any>;
export type ErrorMiddleware = (invocation: any) => Promise<any>;
export interface IMiddleware {
  before?: BeforeMiddleware;
  after?: AfterMiddleware;
  onError?: ErrorMiddleware;
}

const logger = new Logger('core/middleware');

/**
 * Note: this is a dumpter fire. fix me.
 */
export default class Middleware {
  beforeMiddlewares: BeforeMiddleware[] = [];
  afterMiddlewares: AfterMiddleware[] = [];
  errorMiddlewares: ErrorMiddleware[] = [];
  invocation: any;

  constructor(userMiddlewares: IMiddleware[], instance: any) {
    this.invocation = instance;
    userMiddlewares.forEach((middleware) => this.applyMiddleware(middleware));
  }

  public async runBeforeMiddleware() {
    const { beforeMiddlewares } = this;

    logger.debug('runBeforeMiddleware - init');

    if (beforeMiddlewares.length) {
      try {
        this.invocation = await this.runMiddleware(
          beforeMiddlewares[0],
          beforeMiddlewares
        );
      } catch (e) {
        throw e;
      }
    }

    logger.debug('runBeforeMiddleware - returning');
    return this.invocation;
  }

  public async runAfterMiddleware() {
    const { afterMiddlewares } = this;

    logger.debug('runAfterMiddleware - init');

    if (afterMiddlewares.length) {
      this.invocation = await this.runMiddleware(
        afterMiddlewares[0],
        afterMiddlewares
      );
    }

    logger.debug('runAfterMiddleware - returning');

    return this.invocation;
  }

  public async runErrorMiddleware() {
    const { errorMiddlewares } = this;

    logger.debug('runErrorMiddleware - init');

    if (errorMiddlewares.length) {
      this.invocation = await this.runMiddleware(
        errorMiddlewares[0],
        errorMiddlewares
      );
    }

    logger.debug('runErrorMiddleware - returning');

    return this.invocation;
  }

  private applyMiddleware(middleware: IMiddleware) {
    if (typeof middleware !== 'object') {
      throw new Error('Middleware must be an object');
    }

    const { before, after, onError } = middleware;

    if (!before && !after && !onError) {
      throw new Error(
        'Middleware must contain at least one key among "before", "after", "onError"'
      );
    }

    if (before) {
      this.beforeMiddlewares.push(before);
    }

    // reverse order of array
    if (after) {
      this.afterMiddlewares.unshift(after);
    }

    // reverse order of array
    if (onError) {
      this.errorMiddlewares.unshift(onError);
    }
  }

  private async runMiddleware(
    middleware: BeforeMiddleware | AfterMiddleware | ErrorMiddleware,
    middlewareStack: any
  ): Promise<any> {
    logger.debug(`runMiddleware - running`);

    try {
      //
      this.invocation = await middleware(this.invocation);

      logger.debug('runMiddleware - removing ran from stack');

      // remove the current first item
      middlewareStack.shift();

      // if any leftover middleware... go again
      if (middlewareStack.length) {
        logger.debug('runMiddleware - going again');
        return this.runMiddleware(middlewareStack[0], middlewareStack);
      }
    } catch (e) {
      logger.debug('runMiddleware - error', e);
      throw e;
    } finally {
      return this.invocation;
    }
  }
}
