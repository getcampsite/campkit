/**
 * External
 */
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import * as url from 'url';

/**
 * Internal
 */
import { Logger } from './common';
import {
  CampkitApplication,
  CampkitApplicationOptions,
  CampkitHTTPRequest,
} from './campkit.application';

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

interface LambdaOutput {
  statusCode?: number;
  headers?: object;
  body: object;
}

interface AWSLambdaApplicationOptions extends CampkitApplicationOptions {
  httpAdapter: LambdaInput;
}

const logger = new Logger('AWSLambdaApplication');

export class AWSLambdaApplication extends CampkitApplication {
  private event: LambdaEvent;
  private context: LambdaContext;

  constructor(options: AWSLambdaApplicationOptions) {
    super({ module: options.module });
    this.event = options.httpAdapter.event;
    this.context = options.httpAdapter.context;
  }

  handleRequest() {
    const { event, context } = this;
    try {
      const requestOptions = mapApiGatewayEventToHttpRequest({
        event,
        context,
      });
      const out = this.run(requestOptions);

      if (!out) {
        throw new Error('no output from application');
      }

      const res = this.handleLambdaResponse(context, {
        body: out,
      });

      return super.handleResponse(res);
    } catch (error) {
      logger.log(error);
      const res = this.handleLambdaResponse(context, {
        statusCode: 502,
        body: { error: error.message, type: error.name },
      });
      return super.handleResponse(res, true);
    }
  }

  handleLambdaResponse(_context: Context, response: LambdaOutput) {
    const { statusCode = 200, headers = {}, body = {} } = response;
    return {
      statusCode,
      headers: {
        ...headers,
        'x-campkit': true,
      },
      body: JSON.stringify(body),
    };
  }
}

function mapApiGatewayEventToHttpRequest({
  event,
  context,
}: LambdaInput): CampkitHTTPRequest {
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
    method: event.httpMethod,
    path: getPathWithQueryStringParams(event),
    headers,
    body: getEventBody(event),
  };
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
