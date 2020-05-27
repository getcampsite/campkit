/**
 * External
 */
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  Context,
} from 'aws-lambda';

/**
 * Internal
 */
import Middleware, { IMiddleware } from './middleware';

/**
 * Interfaces
 */
export interface LambdaEvent extends APIGatewayProxyEvent {
  isOffline?: boolean;
}

export interface LambdaContext extends Context {}

export interface LambdaHandler extends APIGatewayProxyHandler {}

interface HandlerProps {
  event: LambdaEvent;
  context: LambdaContext;
}

interface InvocationInstance extends HandlerProps {
  response: null | unknown;
  error: null | unknown;
}

export interface CampkitInput extends HandlerProps {
  event: LambdaEvent;
  context: LambdaContext;
  handler: (props: HandlerProps | any) => Promise<any>; // APIGatewayProxyResult
  middleware?: IMiddleware[];
}

const campkit = async ({
  event,
  context,
  handler,
  middleware = [],
}: CampkitInput) => {
  if (!event || !context) {
    throw new Error('campkit requires lambda event and context');
  }

  if (typeof handler !== 'function') {
    throw new Error('handler must be a function');
  }

  let invocation: InvocationInstance = {
    event,
    context,
    response: null,
    error: null,
  };

  if (!middleware.length) {
    return await handler(invocation);
  }

  const m = new Middleware(middleware, invocation);

  try {
    invocation = await m.runBeforeMiddleware();

    if (invocation.error) {
      invocation = await m.runErrorMiddleware();
      return invocation.response;
    }

    invocation.response = await handler(invocation);

    if (invocation.error) {
      invocation = await m.runErrorMiddleware();
      return invocation.response;
    }

    invocation = await m.runAfterMiddleware();

    return invocation.response;
  } catch (e) {
    console.log('campkit-middleware error: ', e);
    invocation.error = e;

    invocation = await m.runErrorMiddleware();

    return invocation.response;
  }
};

export default campkit;
