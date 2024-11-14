'use strict';

import express from 'express';
import { getUsers, getUserById, postUser, modifyUserById, deleteUserById } from '../controllers/user-controller.js';

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
  .post(postUser);

/**
 * Route to get, modify, or delete a user by ID.
 * @function
 * @param {Object} req - The request object containing user ID in URL params.
 * @param {Object} res - The response object.
 */
userRouter.route('/:id')
  .get(getUserById)
  .put(modifyUserById)
  .delete(deleteUserById);

export default userRouter;
