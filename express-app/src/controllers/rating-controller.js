'use strict';
import { fetchMediaItemsById } from '../models/media-model.js';
import { fetchUserById } from '../models/user-models.js';
import {
  fetchRatings,
  fetchRatingById,
  fetchRatingsByUserId,
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
    if (ratings) {
      res.json(ratings);
    } else {
      res.status(404).json({message: 'Ratings not found'});
    }
  } catch (e) {
    console.error('getRatingsByUserId', e.message);
    res.status(500).json({message: 'Error in getRatingsByUserId database query'});
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
      return res.status(400).json({ message: 'Rating not added: Invalid media_id' });
    }

    // Check if the user exists
    const userExists = await fetchUserById(newRating.user_id);
    if (!userExists) {
      return res.status(400).json({ message: 'Rating not added: Invalid user_id' });
    }

    // Add the rating if both media_id and user_id exist
    const ratingId = await addRating(newRating);
    if (ratingId) {
      res.status(201).json({ message: 'Rating added', ratingId: ratingId });
    } else {
      res.status(400).json({ message: 'Rating not added: failure' });
    }
  } catch (e) {
    if (e.message === 'Duplicate entry, rating already exists') {
      res.status(400).json({ message: 'Rating not added: Rating already exists.' });
    } else {
      console.error('postRating', e.message);
      res.status(500).json({ message: 'Error in postRating database query' });
    }
  }
};


const modifyRatingById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const modifiedRating = {
      rating_value: req.body.rating_value,
    };
    const result = await modifyRating(id, modifiedRating);
    if (result) {
      res.json({message: 'Rating modified', id: id});
    } else {
      res.status(404).json({message: 'Rating not found'});
    }
  } catch (e) {
    console.error('modifyRatingById', e.message);
    res.status(500).json({message: 'Error in modifyRatingById database query'});
  }
};


const deleteRatingById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await deleteRating(id);
    if (result.success) {
      res.status(200).json({message: `Rating with ID ${id} was deleted.`});
    } else if (result.error === 'Rating not found') {
      res.status(404).json({message: `Rating with ID ${id} not found.`});
    } else {
      res.status(500).json({message: result.error});
    }
  } catch (e) {
    console.error('deleteRatingById', e.message);
    res.status(500).json({message: 'Error in deleteRatingById database query'});
  }
};

export {getRatings, getRatingById, getRatingsByUserId, postRating, modifyRatingById, deleteRatingById};
 