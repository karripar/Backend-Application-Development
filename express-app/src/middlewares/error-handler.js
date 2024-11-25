import { validationResult } from 'express-validator';

/**
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack
 * @returns {Object} - A JSON object with an error message and a status
 */
const validationErrorHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       const errorString = errors.array().map(err => err.path).join(', '); 
       return res.status(400).json(`Validation error: ${errorString}`);
    }
    next();
}

/**
 * 
 * @param {string} message Error message
 * @param {string} status HTTP status code
 * @returns {object} Error object
 */
const customError = (message, status) => {
    const error = new Error(message);
    error.status = status || 500;
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
    const error = new Error(`Not found - ${req.originalUrl}`);
    error.status = 404;
    return next(error);
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