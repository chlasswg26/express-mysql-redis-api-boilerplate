const changeCase = require('change-case');
const difference = require('lodash').difference;

const defineProperty = (obj, propName, propValue) => {
  Object.defineProperty(obj, propName, {
    value: propValue,
    configurable: true,
    enumerable: false,
    writable: false,
  });
};
/**
Base error class
*/
class BaseApiError extends Error {
  /**
  * @param {String} message - error message to send over wire
  * @options {Object} options (optional)
  * @options.statusCode {Number} - http status code to send over wire
  * @options.customCode {Number} - custom error code to provide in response body
  */
  constructor(message, { statusCode = 500, name = 'InternalApi', customCode = null }) {
    super(message);
    defineProperty(this, 'name', `${name}Error`);
    defineProperty(this, 'message', message || name);
    defineProperty(this, 'statusCode', statusCode);
    defineProperty(this, 'customCode', customCode);
  }

  /**
  * Munges CapitalCaseError name toCase, sans "Error" suffix
  */
  repr(toCase) {
    return changeCase[toCase](this.name.replace('Error', ''));
  }
}

function define(defaultName, defaultCode) {
  global[`${defaultName}Error`] = class extends BaseApiError {
    constructor(message, options = {}) {
      const statusCode = options.statusCode || defaultCode;
      const name = options.name || defaultName;
      super(message, { statusCode, name });
    }
  };
}

function register() {
  define('NotImplemented', 500);
  define('NotFound', 404);
  define('AlreadyExists', 409);
  define('InvalidCredentials', 403);
  define('NotSupported', 405);
  define('Unauthorized', 401);
  // @todo enable when PIN is used to authorize already-existing phone numbers comine from new devices
  // define('PinRequired', 401)

  global['ApiError'] = BaseApiError;

  global['MissingHeadersError'] = class extends BaseApiError {
    constructor(message, options = {}) {
      const { required, provided, statusCode = 400 } = options;
      if (!message && required && provided) {
        message = `Required headers not set: ${difference(required, provided).join(', ')}`;
      }
      super(message, { statusCode, name: 'MissingHeaders' });
    }
  };

  global['InvalidParametersError'] = class extends BaseApiError {
    constructor(message, options = {}) {
      const { required, provided, statusCode = 400 } = options;
      if (!message && required && provided) {
        message = `Required parameters not provided: ${difference(required, provided).join(', ')}`;
      }
      super(message, { statusCode, name: 'InvalidParameters' });
    }
  };
}

module.exports.register = register;
module.exports.BaseApiError = BaseApiError;
