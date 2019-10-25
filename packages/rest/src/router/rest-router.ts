/**
 * External
 */
import RadixRouter from 'radix-router';
import queryString from 'query-string';
import { HttpRequest } from '@campkit/common';

export class RestRouter {
  protected router = new RadixRouter();
  protected HttpRequest: HttpRequest;
  private path: string;
  private pathWithoutQueryString: string;

  constructor(HttpRequest: HttpRequest) {
    this.HttpRequest = HttpRequest;
    this.path = this.setInvokedPath();
    this.pathWithoutQueryString = this.setInvokedPathWithoutQuery();
  }

  public addRoute(route: any) {
    const { path, handler } = route;
    this.router.insert({ path, handler });
  }

  private setInvokedPath() {
    const { method, path } = this.HttpRequest;
    return `[${method}]${path}`;
  }

  private setInvokedPathWithoutQuery() {
    const { method, path } = this.HttpRequest;
    const pathWithoutQueryString = ('' + path).split('?')[0];
    return `[${method}]${pathWithoutQueryString}`;
  }

  /**
   * Find a route by http path
   * example: "/users/123" -> "/users/:id"
   */
  public find() {
    const { path, body, headers } = this.HttpRequest;
    const route = this.router.lookup(this.pathWithoutQueryString);
    const queryStringParams = ('' + path).split('?')[1];

    const qs = queryStringParams
      ? queryString.parse(queryStringParams, {
          parseNumbers: true,
          parseBooleans: true,
        })
      : {};

    let augmentedRoute = {
      ...route,
      query: qs,
      headers,
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
