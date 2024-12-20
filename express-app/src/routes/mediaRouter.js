'use strict';

import express from 'express';
import { getItems, getItemById, postItem, modifyItem, deleteItem } from '../controllers/media-controller.js';
import multer from 'multer';
import { authenticateToken } from '../middlewares/authentication.js';

const upload = multer({ 
  dest: 'uploads/',
  limits: {fileSize: 2 * 1024 * 1024},
 });

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
  .post(authenticateToken, upload.single('file'), postItem)
;

mediaRouter.route('/:id')
  .get(getItemById)
  .put(authenticateToken, modifyItem)
  .delete(authenticateToken, deleteItem);


export default mediaRouter;


