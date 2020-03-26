import { Handler, Context } from 'aws-lambda';
import { CampkitFactory } from '@campkit/core';
import { _SERVICENAME_App } from './_servicename_.app';

export const handler: Handler = async (event: any, context: Context) => {
  return await CampkitFactory.create(_SERVICENAME_App, {
    event,
    context,
  });
};
