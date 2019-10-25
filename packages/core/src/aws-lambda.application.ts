/**
 * External
 */
import * as url from 'url';
import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { Logger, HttpRequest, HttpMethod } from '@campkit/common';

/**
 * Internal
 */
import { CampkitApplication } from './campkit.application';
import { CampkitApplicationOptions } from './types/index';

/**
 * Interfaces
 */
interface LambdaEvent extends APIGatewayProxyEvent {
  isOffline?: boolean;
}

interface LambdaContext extends Context {}

interface LambdaInput {
  event: LambdaEvent;
  context: LambdaContext;
}

interface LambdaOutput extends APIGatewayProxyResult {
  statusCode: number;
  headers?: {
    [header: string]: boolean | number | string;
  };
  body: string;
}

interface AWSLambdaApplicationOptions extends CampkitApplicationOptions {
  httpAdapter: LambdaInput;
}

const logger = new Logger('AWSLambdaApplication');

/**
 * AWSLambdaApplication inherits from CampkitApplication
 */
export class AWSLambdaApplication extends CampkitApplication {
  private event: LambdaEvent;
  private context: LambdaContext;

  constructor(options: AWSLambdaApplicationOptions) {
    super({ module: options.module });
    this.event = options.httpAdapter.event;
    this.context = options.httpAdapter.context;
  }

  async handleRequest() {
    const { event, context } = this;
    try {
      const eventType = this.determineLambdaInvocationType(event);
      switch (eventType) {
        case 'http':
          return this.handleHttpRequest();
        case 'authorizer':
          return this.handleAuthorizerRequest();
        case 'event':
          return this.handleEventRequest();
        default:
          throw new Error('Lambda event unknown');
      }
    } catch (error) {
      logger.log(error);
    }
  }

  /**
   *
   * @param _context
   * @param response
   */
  handleLambdaResponse(response: LambdaOutput): LambdaOutput {
    const { statusCode = 200, headers = {}, body } = response;
    return {
      statusCode,
      headers,
      body,
    } as LambdaOutput;
  }

  /**
   *
   * @param event
   */
  determineLambdaInvocationType(event: LambdaEvent) {
    if (event.hasOwnProperty('authorizationToken')) {
      return 'authorizer';
    }

    if (event.hasOwnProperty('triggerSource')) {
      return 'event';
    }

    return 'http';
  }

  /**
   *
   */
  async handleHttpRequest() {
    const { event, context } = this;
    try {
      const httpRequest = mapApiGatewayEventToHttpRequest({ event, context });
      const responseToHttpRequest = await this.runRestApplication(httpRequest);

      if (!responseToHttpRequest) {
        throw new Error('no response from the http request');
      }

      const res = this.handleLambdaResponse({
        statusCode: 200,
        body: JSON.stringify(responseToHttpRequest),
      });

      return this.handleRestApplicationResponse(res);
    } catch (error) {
      logger.log(error, 'handleHttpRequest');
      const res = this.handleLambdaResponse({
        statusCode: 502,
        body: JSON.stringify({ error: error.message, type: error.name }),
      });
      return this.handleRestApplicationResponse(res, true);
    }
  }

  handleAuthorizerRequest() {
    // const { event, context } = this;
  }

  async handleEventRequest() {
    const { event } = this;
    try {
      const responseToEventRequest = await this.runEventApplication(event);

      if (!responseToEventRequest) {
        throw new Error('no response from the event request');
      }

      return responseToEventRequest;
    } catch (error) {
      logger.log(error, 'handleEventRequest');
      return error;
    }
  }
}

function mapApiGatewayEventToHttpRequest({
  event,
  context,
}: LambdaInput): HttpRequest {
  const headers = Object.assign(
    {
      'Content-Length': 0,
    },
    event.headers
  );

  // NOTE: API Gateway is not setting Content-Length header on requests even when they have a body
  if (event.body && !headers['Content-Length']) {
    const body = getEventBody(event);
    if (Object.keys(body).length) {
      headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
    }
  }

  const clonedEventWithoutBody = clone(event);
  delete clonedEventWithoutBody.body;

  headers['x-apigateway-event'] = encodeURIComponent(
    JSON.stringify(clonedEventWithoutBody)
  );
  headers['x-apigateway-context'] = encodeURIComponent(JSON.stringify(context));

  return {
    method: event.httpMethod as HttpMethod,
    path: getPathWithQueryStringParams(event),
    headers,
    body: getEventBody(event),
  } as HttpRequest;
}

function getPathWithQueryStringParams(event: LambdaEvent) {
  return url.format({
    pathname: event.path,
    query: event.queryStringParameters,
  });
}

function getEventBody(event: LambdaEvent) {
  if (event.body) {
    // return Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');
    return event.body;
  }
  return {};
}

function clone(json: object) {
  return JSON.parse(JSON.stringify(json));
}
