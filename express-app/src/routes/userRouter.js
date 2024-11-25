'use strict';

import express from 'express';
import { getUsers, getUserById, postUser, modifyUserById, deleteUserById } from '../controllers/user-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import {body} from 'express-validator';
import { validationErrorHandler } from '../middlewares/error-handler.js';

const userRouter = express.Router();

// User resource endpoints

/**
 * Route to get all users and create a new user.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
userRouter
  .route('/')
  .get(getUsers)
  .post(
    body('username').trim().isAlphanumeric().isLength({min: 3, max: 20}),
    body('password').isLength({min: 8}),
    body('email').isEmail(),
    validationErrorHandler,
    postUser);

/**
 * Route to get, modify, or delete a user by ID.
 * @function
 * @param {Object} req - The request object containing user ID in URL params.
 * @param {Object} res - The response object.
 */
userRouter.route('/:id')
  .get(getUserById)
  .put(authenticateToken,
    body('username').trim().isAlphanumeric().isLength({min: 3, max: 20}),
    body('password').isLength({min: 8}),
    body('email').isEmail(),
    validationErrorHandler,
    modifyUserById)
  .delete(authenticateToken, deleteUserById);


export default userRouter;
