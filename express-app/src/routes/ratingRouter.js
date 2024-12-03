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
  .get(
    /**
     * @api {get} /ratings Get all ratings
     * @apiVersion 1.0.0
     * @apiName GetRatings
     * @apiGroup Ratings
     * @apiPermission All
     * 
     * @apiDescription Get all ratings.
     * 
     * @apiSuccess {Object[]} ratings List of ratings.
     * 
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 200 OK
     * {
     * "ratings": [
     * {
     * "rating_id": 1,
     * "rating_value": 5,
     * "media_id": 1,
     * "user_id": 1,
     * "createdAt": "2021-06-25T18:53:05.000Z",
     * }
     * ]
     * 
     * */
    getRatings)
  .post(
    /**
     * @api {post} /ratings Create new rating
     * @apiVersion 1.0.0
     * @apiName PostRating
     * @apiGroup Ratings
     * @apiPermission All
     *
     * @apiDescription Create a new rating.
     * 
     * @apiParam {Number} rating_value Rating value.
     * @apiParam {Number} media_id Media ID.
     * 
     * @apiParamExample {json} Request-Example:
     * {
     * "rating_value": 5,
     * "media_id": 1
     * }
     * 
     * @apiSuccess {String} message Rating created successfully.
     * @apiSuccess {Object} rating Created rating info.
     * 
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 201 Created
     * {
     * "message": "Rating created successfully",
     * "rating": {
     * "rating_id": 1,
     * "rating_value": 5,
     * "media_id": 1,
     * "user_id": 1,
     * "createdAt": "2021-06-25T18:53:05.000Z",
     * }
     * 
     * 
     * */
    body('rating_value').isInt({min: 1, max: 5}),
    validationErrorHandler,
    postRating);



ratingRouter.route('/user/:id')
  .get(
    /**
     * @api {get} /ratings/user/:id Get ratings by user ID
     * @apiVersion 1.0.0
     * @apiName GetRatingsByUserId
     * @apiGroup Ratings
     * @apiPermission All
     * 
     * @apiDescription Get all ratings for a specific user.
     *  
     * @apiParam {Number} id User ID.
     * 
     * @apiSuccess {Object[]} ratings List of ratings.
     *  
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 200 OK
     * {
     * "ratings": [
     * {
     * "rating_id": 1,
     * "rating_value": 5,
     * "media_id": 1,
     * "user_id": 1,
     * "createdAt": "2021-06-25T18:53:05.000Z",
     * }
     * ]
     * 
     * */
    getRatingsByUserId);



ratingRouter.route('/media/:id')
  .get(
    /**
     * @api {get} /ratings/media/:id Get ratings by media ID
     * @apiVersion 1.0.0
     * @apiName GetRatingsByMediaId
     * @apiGroup Ratings
     * @apiPermission All
     * 
     * 
     * @apiDescription Get all ratings for a specific media item.
     * 
     * @apiParam {Number} id Media ID.
     * 
     * @apiSuccess {Object[]} ratings List of ratings.
     * 
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 200 OK
     * {
     * "ratings": [
     * {
     * "rating_id": 1,
     * "rating_value": 5,
     * "media_id": 1,
     * "user_id": 1,
     * "createdAt": "2021-06-25T18:53:05.000Z",
     * }
     * ]
     * 
     * */
    getRatingsByMediaId);



ratingRouter.route('/:id')
  .get(
    /**
     * @api {get} /ratings/:id Get rating by ID
     * @apiVersion 1.0.0
     * @apiName GetRatingById
     * @apiGroup Ratings
     * @apiPermission All
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

