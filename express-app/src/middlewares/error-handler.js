import { validationResult } from 'express-validator';

/**
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack
 * @returns {Object} - A JSON object with an error message and a status
 */
const validationErrorHandler = (req, res, next) => {
  // validation errors can be retrieved from the request object (added by express-validator middleware)
  //const errors = validationResult(req);
  const errors = validationResult(req, {strictParams: ['body']});
  // check if any validation errors
  if (!errors.isEmpty()) {
    // console.log('validation errors', errors.array({onlyFirstError: true}));
    // extract field names & messages from error array (only one error per field)
    const validationErrors = errors.array({onlyFirstError: true}).map((error) => {
      return {field: error.path, msg: error.msg};
    });
    return next(customError('Invalid input data', 400, validationErrors));
  }
  next();
};
/**
 * 
 * @param {string} message Error message
 * @param {string} status HTTP status code
 * @returns {object} Error object
 */
const customError = (message, status, errors) => {
    const error = new Error(message);
    error.status = error.status = Number.isInteger(status) ? status : 500;
    if (errors) {
      error.errors = errors;
    }
    return error
  };

// notFoundHandler is a middleware function that will be called when no other route is matched.
/**
 * 
 * @param {Object} req - The request object.    
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack
 * @returns {Object} - A JSON object with an error message and  
 * a status code of 404
 */
const notFoundHandler = (req, res, next) => {
  const error = customError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

/**
 * 
 * @param {Object} err - The error object
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack
 * @returns {Object} - A JSON object with an error message and
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500); // default is 500 if err.status is not defined
    res.json({
      error: {
        message: err.message,
        status: err.status || 500
      }
    });
  };

export {notFoundHandler, errorHandler, customError, validationErrorHandler};