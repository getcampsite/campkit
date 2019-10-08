/**
 * External
 */
import RadixRouter from 'radix-router';
import queryString from 'query-string';
import { CampkitHTTPRequest } from '@campkit/core';

interface HTTPRequest extends CampkitHTTPRequest {}

export class RestRouter {
  protected router = new RadixRouter();
  protected httpRequest: HTTPRequest;
  private path: string;
  private pathWithoutQueryString: string;

  constructor(httpRequest: HTTPRequest) {
    this.httpRequest = httpRequest;
    this.path = this.setInvokedPath();
    this.pathWithoutQueryString = this.setInvokedPathWithoutQuery();
  }

  public addRoute(route: any) {
    const { path, handler } = route;
    this.router.insert({ path, handler });
  }

  private setInvokedPath() {
    const { method, path } = this.httpRequest;
    return `[${method}]${path}`;
  }

  private setInvokedPathWithoutQuery() {
    const { method, path } = this.httpRequest;
    const pathWithoutQueryString = ('' + path).split('?')[0];
    return `[${method}]${pathWithoutQueryString}`;
  }

  /**
   * Find a route by http path
   * example: "/users/123" -> "/users/:id"
   */
  public find() {
    const { path, body } = this.httpRequest;
    const route = this.router.lookup(this.pathWithoutQueryString);

    // ?some=param
    const qs = queryString.parse(('' + path).split('?')[1], {
      parseNumbers: true,
      parseBooleans: true,
    });

    let augmentedRoute = {
      ...route,
      query: qs,
    };

    if (body) {
      augmentedRoute = {
        ...augmentedRoute,
        body: body, //@todo: handle not json case
      };
    }

    return augmentedRoute;
  }
}
