// error-handling middleware
const BaseApiError = require('../lib/error').BaseApiError;

module.exports = (err, req, res, next) => {
  if (err instanceof BaseApiError) {
    const { message, customCode, statusCode } = err;
    return res.status(statusCode).send({
      type: err.repr('snake'),
      message,
      customCode,
    });
  } else if (process.env.NODE_ENV === 'dev') {
    // sends error stack across the wire in development only
    console.error(err);
    return res.status(500).send({
      stack: err,
      type: 'internal_error',
      message: 'An uncaught error occurred',
    });
  } else {
    // sends a generic 500 error for all uncaught exceptions
    console.error(err);
    return res.status(500).send({
      type: 'internal_error',
      message: 'An uncaught error occurred',
    });
  }
};
