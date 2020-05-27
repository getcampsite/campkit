/**
 * External
 */
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { HttpRequest, HttpMethod } from '@campkit/common';

/**
 * Interfaces
 */
export interface LambdaEvent extends APIGatewayProxyEvent {
  isOffline?: boolean;
}

export interface LambdaContext extends Context {}

interface HandlerProps {
  event: LambdaEvent;
  context: LambdaContext;
}

// { event, context }: HandlerProps
export const useHttp = () => ({
  before: async (invocation: any) => {
    const { event, context } = invocation;

    if (!event || !context) {
      return invocation;
    }

    const { body, params, query, headers } = mapApiGatewayEventToHttpRequest({
      event,
      context,
    });

    const getBody = (b: any) => {
      try {
        // const _ = JSON.parse(b, (_k, v) => {
        //   console.log(typeof v);
        //   return typeof v === 'object' || isNaN(v) ? v : parseInt(v, 10);
        // });
        return JSON.parse(b);
      } catch (e) {
        return b;
      }
    };

    invocation = {
      ...invocation,
      req: {
        body: getBody(body),
        params: params || {},
        query: query || {},
        headers,
      },
      res: {
        json: (data: any) => {
          return {
            status: (code: number) => {
              if (code >= 400) {
                invocation.error = { data, code };
              } else {
                invocation.response = { data, code };
              }
              return { data, code };
            },
          };
        },
      },
    };

    return invocation;
  },
});

function mapApiGatewayEventToHttpRequest({
  event,
  context,
}: HandlerProps): HttpRequest {
  const headers = Object.assign(
    {
      'Content-Length': 0,
    },
    event.headers
  );

  // NOTE: API Gateway is not setting Content-Length header on requests even when they have a body
  if (event.body && !headers['Content-Length']) {
    const body = event.body || {};
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
    params: event.pathParameters,
    query: event.queryStringParameters,
    headers,
    body: event.body || {},
  } as HttpRequest;
}

function clone(json: object) {
  return JSON.parse(JSON.stringify(json));
}
