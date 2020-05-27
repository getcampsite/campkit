/**
 * External
 */
import Ajv from 'ajv';

/**
 * Interfaces
 */
export interface ValidatorConfig {
  inputSchema?: any;
  outputSchema?: any;
  ajvOptions?: any;
}

const defaults = {
  v5: true,
  coerceTypes: 'array', // important for query string params
  allErrors: true,
  useDefaults: true,
  $data: true, // required for ajv-keywords
  defaultLanguage: 'en',
};

export const useValidator = ({
  inputSchema,
  ajvOptions = {},
}: ValidatorConfig) => ({
  before: async (invocation: any) => {
    const { req } = invocation;

    if (!req || !inputSchema) {
      return invocation;
    }

    const options = Object.assign({}, defaults, ajvOptions);
    const ajv = new Ajv(options);
    const valid = ajv.validate(inputSchema, req);

    if (!valid) {
      console.log('----- ERROR: ', ajv.errors);
      invocation.error = {
        message: 'validation failed',
        type: 'validation',
        code: 400,
      };

      // throw new Error('validation failed');
    }

    return invocation;
  },
});
