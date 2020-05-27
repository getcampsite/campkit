/**
 * External
 */
import { Logger } from '@campkit/common';

const logger = new Logger('middleware/useJsonResponse');

export const useJsonResponse = () => ({
  after: async (invocation: any) => {
    const { response } = invocation;
    const data = response.data || {};
    const code = response.code || 200;

    invocation.response = {
      statusCode: code,
      body: JSON.stringify(data, null, 2),
    };

    logger.debug('useJSONResponse - after - returning');

    return invocation;
  },
  onError: async (invocation: any) => {
    const { error } = invocation;

    let data = {};
    let code = 500;

    if (error instanceof Error || (error.stack && error.message)) {
      // handle a legit error
      data = {
        error: error.message,
      };
    } else {
      // handle a formatted error
      data = (error || {}).data || data;
      code = (error || {}).code || code;
    }

    invocation.response = {
      statusCode: code,
      body: JSON.stringify(data, null, 2),
    };

    logger.debug('useJSONResponse - onError - returning');

    return invocation;
  },
});
