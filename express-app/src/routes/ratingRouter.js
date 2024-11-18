import express from 'express';
import { getRatings, getRatingById, getRatingsByMediaId, getRatingsByUserId, postRating, modifyRatingById, deleteRatingById } from '../controllers/rating-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';

const ratingRouter = express.Router();

// Rating resource endpoints

/**
 * Route to get all ratings and create a new rating.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
ratingRouter
  .route('/')
  .get(getRatings)
  .post(postRating);


/** 
 * Route to get all ratings by a specific user.
 * @function
 * @param {Object} req - The request object containing the user ID in the URL parameters.
 * @param {Object} res - The response object used to send the JSON response.
 */
ratingRouter.route('/user/:id')
  .get(getRatingsByUserId);


/**
 * Route to get all ratings by a specific media.
 * @function
 * @param {Object} req - The request object containing the media ID in the URL parameters.
 * @param {Object} res - The response object used to send the JSON response.
 */
ratingRouter.route('/media/:id')
  .get(getRatingsByMediaId);



/**
 * Route to get, modify, or delete a rating by ID.
 * @function
 * @param {Object} req - The request object containing rating ID in URL params.
 * @param {Object} res - The response object.
 */
ratingRouter.route('/:id')
  .get(getRatingById)
  .put(authenticateToken, modifyRatingById)
  .delete(authenticateToken, deleteRatingById);

export default ratingRouter;

