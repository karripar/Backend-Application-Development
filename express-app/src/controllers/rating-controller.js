'use strict';
import {fetchMediaItemsById} from '../models/media-model.js';
import {fetchUserById} from '../models/user-models.js';
import {
  fetchRatings,
  fetchRatingById,
  fetchRatingsByUserId,
  fetchRatingsByMediaId,
  addRating,
  modifyRating,
  deleteRating,
} from '../models/rating-models.js';
import { customError } from '../middlewares/error-handler.js';

/**
 * Retrieves all ratings from the database and sends them as a JSON response.
 * @function
 * @param {Object} res - The response object used to send the JSON response.
 */

const getRatings = async (req, res, next) => {
  try {
    res.json(await fetchRatings());
  } catch (e) {
    console.error('getRatings', e.message);
    return next(customError('Error in getRatings database query', 500));
  }
};

/**
 * Retrieves a rating by its ID from the database and sends it as a JSON response.
 * @function
 * @param {Object} req - The request object containing the rating ID in the URL parameters.
 * @param {Object} res - The response object used to send the JSON response.
 */
const getRatingById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const rating = await fetchRatingById(id);
    if (rating) {
      res.json(rating);
    } else {
      return next(customError('Rating not found', 404));
    }
  } catch (e) {
    console.error('getRatingById', e.message);
    return next(customError('Error in getRatingById database query', 500));
  }
};

/**
 * Fetches all ratings by a specific user from the database.
 * @function
 * @param {Object} req - The request object containing the user ID in the URL parameters.
 * @param {Object} res - The response object used to send the JSON response.
 */
const getRatingsByUserId = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const ratings = await fetchRatingsByUserId(id);
    if (ratings && ratings.length > 0) {
      res.json(ratings);
    } else {
      return next(customError('Ratings not found for user ID ' + id, 404));
    }
  } catch (e) {
    console.error('getRatingsByUserId', e.message);
    return next(customError('Error in getRatingsByUserId database query', 500));
  }
};

/**
 * @function
 * @param {Object} req - The request object containing the media ID in the URL parameters.
 * @param {Object} res - The response object used to send the JSON response.
 */
const getRatingsByMediaId = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const ratings = await fetchRatingsByMediaId(id);
    if (ratings && ratings.length > 0) {
      res.json(ratings);
    } else {
      return next(customError('Ratings not found for media ID ' + id, 404));
    }
  } catch (e) {
    console.error('getRatingsByMediaId', e.message);
    return next(customError('Error in getRatingsByMediaId database query', 500));
  }
};

/**
 * Adds a new rating to the database.
 * @function
 * @param {Object} req - The request object containing the rating data in the request body.
 * @param {Object} res - The response object used to send the JSON response.
 */
const postRating = async (req, res, next) => {
  const newRating = {
    rating_value: req.body.rating_value,
    media_id: req.body.media_id,
    user_id: req.body.user_id,
  };

  try {
    // Check if the media item exists
    const mediaExists = await fetchMediaItemsById(newRating.media_id);
    if (!mediaExists) {
      return next(customError('Rating not added: Invalid media_id', 400));
    }

    // Check if the user exists
    const userExists = await fetchUserById(newRating.user_id);
    if (!userExists) {
      return next(customError('Rating not added: Invalid user_id', 400));
    }

    // Add the rating if both media_id and user_id exist
    const ratingId = await addRating(newRating);
    if (ratingId) {
      res.status(201).json({message: 'Rating added', ratingId: ratingId});
    } else {
      return next(customError('Rating not added: Failure', 400));
    }
  } catch (e) {
    if (e.message === 'Duplicate entry, rating already exists') {
      return next(customError('Rating not added: Rating already exists', 400));
    } else {
      console.error('postRating', e.message);
      return next(customError('Error in postRating database query', 500));
    }
  }
};

/**
 * Modifies a rating in the database.
 * @function
 * @param {Object} req - The request object containing the rating ID in the URL parameters and the modified rating data in the request body.
 * @param {Object} res - The response object used to send the JSON response.
 * @returns {Object} - A JSON response indicating whether the rating was modified successfully.
 * @throws {Object} - A JSON response indicating that the rating was not found.
 * @throws {Object} - A JSON response indicating that the user can only modify their own ratings.
 * @throws {Object} - A JSON response indicating an error in the database query.
 */
const modifyRatingById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const modifiedRating = {
    rating_value: req.body.rating_value,
  };

  // Validate the rating value
  if (
    !Number.isInteger(modifiedRating.rating_value) ||
    modifiedRating.rating_value < 1 ||
    modifiedRating.rating_value > 5
  ) {
    return next(customError('Invalid rating value. Must be an integer between 1 and 5.', 400));
  }

  try {
    // Fetch the existing rating
    const item = await fetchRatingById(id);
    if (!item) {
      return next(customError('Rating not found', 404));
    }

    // Admins can modify any rating, regular users can only modify their own
    if (req.user.user_level_id !== 2 && item.user_id !== req.user.user_id) {
      return next(customError('You can only modify your own ratings', 403));
    }

    // Perform the modification
    const result = await modifyRating(id, modifiedRating);
    if (result) {
      res.status(200).json({message: 'Rating modified successfully.', id});
    } else {
      return next(customError('Rating not found', 404));
    }
  } catch (e) {
    console.error('modifyRatingById Error:', e.message);
    return next(customError('Error in modifyRatingById database query', 500));
  }
};

/**
 * Deletes a rating from the database.
 * @function
 * @param {Object} req - The request object containing the rating ID in the URL parameters.
 * @param {Object} res - The response object used to send the JSON response.
 */
const deleteRatingById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const item = await fetchRatingById(id); // Ensure you're awaiting the result of fetchRatingById
    if (!item) {
      return next(customError('User not found', 404));
    }

    // Admins can delete any rating, regular users can only delete their own
    if (req.user.user_level_id !== 2 && item.user_id !== req.user.user_id) {
      return next(customError('You can only delete your own ratings', 403));
    }

    // Proceed to delete the rating
    const result = await deleteRating(id);
    if (result.success) {
      res.status(204).json({message: 'Rating deleted', id});
    } else if (result.error === 'Rating not found') {
      return next(customError('Rating not found', 404));
    } else {
      return next(customError('Error in deleteRating database query', 500));
    }
  } catch (e) {
    console.error('deleteRatingById Error:', e.message);
    return next(customError('Error in deleteRatingById database query', 500));
  }
};

export {
  getRatings,
  getRatingById,
  getRatingsByMediaId,
  getRatingsByUserId,
  postRating,
  modifyRatingById,
  deleteRatingById,
};
