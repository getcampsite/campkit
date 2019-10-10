import { CampkitFactory } from '@campkit/core';
import { _SERVICENAME_App } from './_servicename_.app';

export async function handler(event, context) {
  return await CampkitFactory.create(_SERVICENAME_App, { event, context });
}
