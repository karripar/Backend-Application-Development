'use strict';

import express from 'express';
import {
  getItems,
  getItemById,
  postItem,
  modifyItem,
  deleteItem,
} from '../controllers/media-controller.js';

import {authenticateToken} from '../middlewares/authentication.js';
import 'dotenv/config';
import {body} from 'express-validator';
import upload from '../middlewares/upload.js';
import { validationErrorHandler } from '../middlewares/error-handler.js'

;
const mediaRouter = express.Router();

// Media resource endpoints

/**
 * Route to get all media items.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
mediaRouter
  .route('/')
  .get(getItems)
  .post(
    /**
     * @api {post} /media Create new media item
     * @apiVersion 1.0.0
     * @apiName PostMedia
     * @apiGroup Media
     * @apiPermission token
     * 
     * @apiDescription Create a new media item.
     * 
     * @apiParam {String} title Title of the media item.
     * @apiParam {String} description Description of the media item.
     * @apiParam {File} file File to upload.
     * 
     * @apiParamExample {json} Request-Example:
     *   {
     *    "title": "My new media item",
     *   "description": "This is a new media item",
     *  "file": "file.jpg"
     * }
     * 
     * @apiSuccess {String} message Media item created successfully.
     * @apiSuccess {Object} media Media item created.
     *  
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 201 Created
     * {
     * "message": "Media item created successfully",
     * "media": {
     * "id": 1,
     * "title": "My new media item",
     * "description": "This is a new media item",
     * "file": "file.jpg",
     * "userId": 1,
     * "createdAt": "2021-06-25T18:53:05.000Z"
     * }
     * 
     * @apiUse token
     * @apiUse UnauthorizedError
     */

    authenticateToken,
    upload.single('file'),
    body('title').trim().isLength({min: 3, max: 50}),
    body('description').trim().isLength({max: 255}),
    validationErrorHandler,
    postItem,
  );

mediaRouter
  .route('/:id')
  .get(
    /**
     * @api {get} /media/:id Get media item by ID
     * @apiVersion 1.0.0
     * @apiName GetMedia
     * @apiGroup Media
     * @apiPermission token
     * 
     * @apiDescription Get a media item by ID.
     * 
     * @apiSuccess {Object} media Media item.
     * 
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 200 OK
     * {
     * "media": {
     * "id": 1,
     * "title": "My new media item",
     * "description": "This is a new media item",
     * "file": "file.jpg",
     * "userId": 1,
     * "createdAt": "2021-06-25T18:53:05.000Z"
     * }
     * 
     * @apiUse token
     * @apiUse UnauthorizedError
     */
    getItemById)
  .put(
    /**
     * @api {put} /media/:id Update media item
     * @apiVersion 1.0.0
     * @apiName PutMedia
     * @apiGroup Media
     * @apiPermission token
     * 
     * @apiDescription Update a media item.
     * 
     * @apiParam {String} title Title of the media item.
     * @apiParam {String} description Description of the media item.
     * 
     * @apiParamExample {json} Request-Example:
     * {
     * "title": "My updated media item",
     * "description": "This is an updated media item"
     * }
     * 
     * @apiSuccess {String} message Media item updated successfully.
     * @apiSuccess {Object} media Media item updated.
     * 
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 200 OK
     * {
     * "message": "Media item updated successfully",
     * "media": {
     * "id": 1,
     * "title": "My updated media item",
     * "description": "This is an updated media item",
     * "file": "file.jpg",
     * "userId": 1,
     * "createdAt": "2021-06-25T18:53:05.000Z"
     * }
     * 
     * @apiUse token
     * @apiUse UnauthorizedError
     */
    authenticateToken,
    body('title').trim().isLength({min: 3, max: 50}),
    body('description').trim().isLength({max: 255}),
    validationErrorHandler, 
    modifyItem
  )
  .delete(
    /**
     * @api {delete} /media/:id Delete media item
     * @apiVersion 1.0.0
     * @apiName DeleteMedia
     * @apiGroup Media
     * @apiPermission token
     * 
     * @apiDescription Delete a media item.
     * 
     * @apiSuccess {String} message Media item deleted successfully.
     * 
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 200 OK
     * {
     * "message": "Media item deleted successfully"
     * }
     * 
     * @apiUse token
     * @apiUse UnauthorizedError
     * 
     */
    authenticateToken, deleteItem);

export default mediaRouter;
