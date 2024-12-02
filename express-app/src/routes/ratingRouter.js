import express from 'express';
import { getRatings, getRatingById, getRatingsByMediaId, getRatingsByUserId, postRating, modifyRatingById, deleteRatingById } from '../controllers/rating-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import {body} from 'express-validator';
import { validationErrorHandler } from '../middlewares/error-handler.js';

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
  .post(
    body('rating_value').isInt({min: 1, max: 5}),
    validationErrorHandler,
    postRating);


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
  .get(
    /**
     * @api {get} /ratings/:id Get rating by ID
     * @apiVersion 1.0.0
     * @apiName GetRatingById
     * @apiGroup Ratings
     * @apiPermission token
     * 
     * @apiDescription Get a rating by its ID.
     * 
     * @apiParam {Number} id Rating ID.
     * 
     * @apiSuccess {Object} rating Rating info.
     * 
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 200 OK
     * {
     * "rating": {
     * "rating_id": 1,
     * "rating_value": 5,
     * "media_id": 1,
     * "user_id": 1,
     * "createdAt": "2021-06-25T18:53:05.000Z",
     * }
     * 
     */
    getRatingById)
  .put(
    /**
     * @api {put} /ratings/:id Modify rating by ID
     * @apiVersion 1.0.0
     * @apiName PutRatingById
     * @apiGroup Ratings
     * @apiPermission token
     * 
     * @apiDescription Modify a rating by its ID.
     * 
     * @apiParam {Number} rating_value Rating value.
     * 
     * @apiParamExample {json} Request-Example:
     * {
     * "rating_value": 4
     * }
     * 
     * @apiSuccess {String} message Rating updated successfully.
     * @apiSuccess {Object} rating Updated rating info.
     * 
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 200 OK
     * {
     * "message": "Rating updated successfully",
     * "rating": {
     * "rating_id": 1,
     * "rating_value": 4,
     * "media_id": 1,
     * "user_id": 1,
     * "createdAt": "2021-06-25T18:53:05.000Z",
     * }
     * 
     * @apiUse token
     */
    authenticateToken,
    body('rating_value').isInt({min: 1, max: 5}),
    validationErrorHandler,
    modifyRatingById)
  .delete(
    /**
     * @api {delete} /ratings/:id Delete rating by ID
     * @apiVersion 1.0.0
     * @apiName DeleteRatingById
     * @apiGroup Ratings
     * @apiPermission token
     * 
     * @apiDescription Delete a rating by its ID.
     * 
     * @apiSuccess {String} message Rating deleted successfully.
     * 
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 200 OK
     * {
     * "message": "Rating deleted successfully"
     * }
     * 
     * @apiUse token
     */
    authenticateToken, 
    deleteRatingById);

export default ratingRouter;

