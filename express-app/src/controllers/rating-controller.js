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

/**
 * Retrieves all ratings from the database and sends them as a JSON response.
 * @function
 * @param {Object} res - The response object used to send the JSON response.
 */

const getRatings = async (req, res) => {
  try {
    res.json(await fetchRatings());
  } catch (e) {
    console.error('getRatings', e.message);
    res.status(500).json({message: 'Error in getRatings'});
  }
};

/**
 * Retrieves a rating by its ID from the database and sends it as a JSON response.
 * @function
 * @param {Object} req - The request object containing the rating ID in the URL parameters.
 * @param {Object} res - The response object used to send the JSON response.
 */
const getRatingById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const rating = await fetchRatingById(id);
    if (rating) {
      res.json(rating);
    } else {
      res.status(404).json({message: 'Rating not found'});
    }
  } catch (e) {
    console.error('getRatingById', e.message);
    res.status(500).json({message: 'Error in getRatingById database query'});
  }
};

/**
 * Fetches all ratings by a specific user from the database.
 * @function
 * @param {Object} req - The request object containing the user ID in the URL parameters.
 * @param {Object} res - The response object used to send the JSON response.
 */
const getRatingsByUserId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const ratings = await fetchRatingsByUserId(id);
    if (ratings && ratings.length > 0) {
      res.json(ratings);
    } else {
      res.status(404).json({message: 'Ratings not found'});
    }
  } catch (e) {
    console.error('getRatingsByUserId', e.message);
    res
      .status(500)
      .json({message: 'Error in getRatingsByUserId database query'});
  }
};

/**
 * @function
 * @param {Object} req - The request object containing the media ID in the URL parameters.
 * @param {Object} res - The response object used to send the JSON response.
 */
const getRatingsByMediaId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const ratings = await fetchRatingsByMediaId(id);
    if (ratings && ratings.length > 0) {
      res.json(ratings);
    } else {
      res.status(404).json({message: 'Ratings not found for media ID ' + id});
    }
  } catch (e) {
    console.error('getRatingsByMediaId', e.message);
    res
      .status(500)
      .json({message: 'Error in getRatingsByMediaId database query'});
  }
};

/**
 * Adds a new rating to the database.
 * @function
 * @param {Object} req - The request object containing the rating data in the request body.
 * @param {Object} res - The response object used to send the JSON response.
 */
const postRating = async (req, res) => {
  const newRating = {
    rating_value: req.body.rating_value,
    media_id: req.body.media_id,
    user_id: req.body.user_id,
  };

  try {
    // Check if the media item exists
    const mediaExists = await fetchMediaItemsById(newRating.media_id);
    if (!mediaExists) {
      return res
        .status(400)
        .json({message: 'Rating not added: Invalid media_id'});
    }

    // Check if the user exists
    const userExists = await fetchUserById(newRating.user_id);
    if (!userExists) {
      return res
        .status(400)
        .json({message: 'Rating not added: Invalid user_id'});
    }

    // Add the rating if both media_id and user_id exist
    const ratingId = await addRating(newRating);
    if (ratingId) {
      res.status(201).json({message: 'Rating added', ratingId: ratingId});
    } else {
      res.status(400).json({message: 'Rating not added: failure'});
    }
  } catch (e) {
    if (e.message === 'Duplicate entry, rating already exists') {
      res
        .status(400)
        .json({message: 'Rating not added: Rating already exists.'});
    } else {
      console.error('postRating', e.message);
      res.status(500).json({message: 'Error in postRating database query'});
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
const modifyRatingById = async (req, res) => {
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
    return res.status(400).json({
      message: 'Invalid rating value. Must be an integer between 1 and 5.',
    });
  }

  try {
    // Fetch the existing rating
    const item = await fetchRatingById(id);
    if (!item) {
      return res.status(404).json({message: 'Rating not found.'});
    }

    // Admins can modify any rating, regular users can only modify their own
    if (req.user.user_level_id !== 2 && item.user_id !== req.user.user_id) {
      return res
        .status(403)
        .json({message: 'You can only modify your own ratings.'});
    }

    // Perform the modification
    const result = await modifyRating(id, modifiedRating);
    if (result) {
      res.status(200).json({message: 'Rating modified successfully.', id});
    } else {
      res
        .status(404)
        .json({message: 'Failed to modify rating. Rating not found.'});
    }
  } catch (e) {
    console.error('modifyRatingById Error:', e.message);
    res
      .status(500)
      .json({message: 'An error occurred while modifying the rating.'});
  }
};

/**
 * Deletes a rating from the database.
 * @function
 * @param {Object} req - The request object containing the rating ID in the URL parameters.
 * @param {Object} res - The response object used to send the JSON response.
 */
const deleteRatingById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await fetchRatingById(id); // Ensure you're awaiting the result of fetchRatingById
    if (!item) {
      return res.status(404).json({message: 'Rating not found'});
    }

    // Admins can delete any rating, regular users can only delete their own
    if (req.user.user_level_id !== 2 && item.user_id !== req.user.user_id) {
      return res
        .status(403)
        .json({message: 'You can only delete your own ratings'});
    }

    // Proceed to delete the rating
    const result = await deleteRating(id);
    if (result.success) {
      res.status(204).json({message: 'Rating deleted', id});
    } else if (result.error === 'Rating not found') {
      res.status(404).json({message: 'Rating not found'});
    } else {
      res.status(500).json({message: result.error});
    }
  } catch (e) {
    console.error('deleteRatingById Error:', e.message);
    res.status(500).json({message: 'Error in deleteRatingById database query'});
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
