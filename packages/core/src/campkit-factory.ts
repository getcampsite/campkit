/**
 * Internal
 */
import { AWSLambdaApplication } from './aws-lambda.application';

/**
 * Interfaces
 */
interface CampkitFactoryOptions {
  provider: 'aws';
}

/**
 * CampkitFactoryStatic
 */
class CampkitFactoryStatic {
  public async create(
    module: any,
    httpAdapter: any,
    options: CampkitFactoryOptions = {
      provider: 'aws',
    }
  ) {
    const { provider } = options;
    const isAWSLambda = provider === 'aws';

    if (isAWSLambda) {
      const lambdaApp = new AWSLambdaApplication({ module, httpAdapter });
      return lambdaApp.handleRequest();
    } else {
      throw Error('currently only aws lambda events are supported');
    }
  }
}

/**
 * Use CampkitFactory to create an application instance.
 *
 **/
export const CampkitFactory = new CampkitFactoryStatic();
