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
    authenticateToken,
    upload.single('file'),
    body('title').trim().isLength({min: 3, max: 50}),
    body('description').trim().isLength({max: 255}),
    validationErrorHandler,
    postItem,
  );

mediaRouter
  .route('/:id')
  .get(getItemById)
  .put(
    authenticateToken,
    body('title').trim().isLength({min: 3, max: 50}),
    body('description').trim().isLength({max: 255}),
    validationErrorHandler, modifyItem
  )
  .delete(authenticateToken, deleteItem);

export default mediaRouter;
