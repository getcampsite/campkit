import {
  // APIGatewayProxyHandler,
  Context,
  APIGatewayProxyEvent,
} from 'aws-lambda';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';

import { CampkitFactory } from './campkit-factory';

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

export type Handler<TEvent = any, TResult = any> = (
  event: TEvent,
  context: Context
) => void | Promise<TResult>;

// module: any, httpAdapter: LambdaInput
export async function campkit(fn: any, httpAdapter: LambdaInput) {
  console.log('----campkit');

  // const { event, context } = httpAdapter;

  // const v = middy(fn);
  // console.log(v);
  // const b = v.use(jsonBodyParser());
  // return b(_httpAdapter.event, _httpAdapter.context, () => {
  //   console.log('in this callback');
  //   // return { roger: false };
  // });

  const f = await CampkitFactory.create(fn, httpAdapter);

  const a = middy<Handler>(f);

  a.use(jsonBodyParser());

  return a;

  // return handler;
}
