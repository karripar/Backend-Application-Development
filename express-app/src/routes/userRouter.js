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
  .get(
    /**
     * @api {get} /users Get all users
     * @apiVersion 1.0.0
     * @apiName GetUsers
     * @apiGroup Users
     * @apiPermission token
     * 
     * @apiDescription Get all users.
     * 
     * @apiSuccess {Object[]} users List of users.
     * 
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 200 OK
     *  {
     *    "users": [
     *      {
     *        "id": 1,
     *        "username": "johnd",
     *        "email": "john@gmail.com"
     *     },
     *    {
     *     "id": 2,
     *    "username": "janed",
     *  "email": "janed@gmail.com"
     * }
     * ]
     * }
     * 
     * @apiUse UnauthorizedError
     * 
     * @apiUse token
     * 
     * @apiErrorExample Error-Response:
     *    HTTP/1.1 403 Forbidden
     *   {
     *    "error": {
     *    "message": "username/password invalid",
     *   "status": 401
     * }
     * }
     * 
     * @apiErrorExample Error-Response:
     *   HTTP/1.1 403 Forbidden
     * {
     * "error": {
     * "message": "No token provided",
     *  "status": 403
     * }
     * }
     * 
     * */
    authenticateToken,
    getUsers)
  .post(
    /**
     * @api {post} /users Create new user
     * @apiVersion 1.0.0
     * @apiName PostUser
     * @apiGroup Users
     * @apiPermission all
     * 
     * @apiDescription Create a new user.
     * 
     * @apiParam {String} username Username of the user.
     * @apiParam {String} password Password of the user.
     * @apiParam {String} email Email of the user.
     * 
     * @apiParamExample {json} Request-Example:
     *   {
     *     "username": "johnd",
     *     "password": "examplepass",
     *     "email": "johnd@gmail.com"
     *  }
     * 
     * @apiSuccess {String} message User created successfully.
     * @apiSuccess {Object} user User info.
     * 
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 201 Created
     * {
     * "message": "User created successfully",
     * "user": {
     * "id": 21,
     * "username": "johnd",
     * "email": "johnd@gmail.com"
     * }
     *  
     * @apiErrorExample Error-Response:
     *   HTTP/1.1 400 Bad Request
     * {
     * "error": {
     * "message": "Invalid input",
     * "status": 400
     * }
     * }
     * 
     * */
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
  .get(
    /**
     * @api {get} /users/:id Get user by ID
     * @apiVersion 1.0.0
     * @apiName GetUserById
     * @apiGroup Users
     * @apiPermission token
     * 
     * @apiDescription Get a user by its ID.
     * 
     * @apiParam {Number} id User ID.
     * 
     * @apiSuccess {Object} user User info.
     * 
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 200 OK
     * {
     * "user": {
     * "id": 1,
     * "username": "johnd",
     * "email": "johnd@gmail.com"
     * }
     * 
     * @apiErrorExample Error-Response:
     *  HTTP/1.1 404 Not Found
     * {
     * "error": {
     * "message": "User not found",
     * "status": 404
     * }
     * }
     * 
     * */
    getUserById)
  .put(
    /**
     * @api {put} /users/:id Modify user by ID
     * @apiVersion 1.0.0
     * @apiName PutUserById
     * @apiGroup Users
     * @apiPermission token
     * 
     * @apiDescription Modify a user by its ID.
     * 
     * @apiParam {Number} id User ID.
     * @apiParam {String} username Username of the user.
     * @apiParam {String} password Password of the user.
     * 
     * @apiParamExample {json} Request-Example:
     * {
     * "username": "janed",
     * "password": "newpassword",
     * "email": "janed@gmail.com"
     * }
     * 
     * @apiSuccess {String} message User updated successfully.
     * @apiSuccess {Object} user Updated user info.
     * 
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 200 OK
     * {
     * "message": "User updated successfully",
     * "user": {
     * "id": 1,
     * "username": "janed",
     * "email": "janed@gmail.com"
     * }
     * 
     * @apiUse token
     * 
     * @apiUse UnauthorizedError
     * 
     * @apiErrorExample Error-Response:
     * HTTP/1.1 403 Forbidden
     * {
     * "error": {
     * "message": "Unauthorized",
     * "status": 403
     * }
     * 
     * @apiErrorExample Error-Response:
     * HTTP/1.1 404 Not Found
     * {
     * "error": {
     * "message": "User not found",
     * "status": 404
     * }
     * 
     * @apiErrorExample Error-Response:
     * HTTP/1.1 400 Bad Request
     * {
     * "error": {
     * "message": "Invalid input",
     * "status": 400
     * }
     * 
     * */
    authenticateToken,
    body('username').trim().isAlphanumeric().isLength({min: 3, max: 20}),
    body('password').isLength({min: 8}),
    body('email').isEmail(),
    validationErrorHandler,
    modifyUserById)
  .delete(
    /**
     * @api {delete} /users/:id Delete user by ID
     * @apiVersion 1.0.0
     * @apiName DeleteUserById
     * @apiGroup Users
     * @apiPermission token
     * 
     * @apiDescription Delete a user by its ID.
     * 
     * @apiParam {Number} id User ID.
     * 
     * @apiSuccess {String} message User deleted successfully.
     * 
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 200 OK
     * {
     * "message": "User deleted successfully"
     * }
     * 
     * @apiUse token
     * 
     * @apiUse UnauthorizedError
     * 
     * @apiErrorExample Error-Response:
     * HTTP/1.1 403 Forbidden
     * {
     * "error": {
     * "message": "Unauthorized",
     * "status": 403
     * }
     * 
     * @apiErrorExample Error-Response:
     * HTTP/1.1 404 Not Found
     * {
     * "error": {
     * "message": "User not found",
     * "status": 404
     * }
     * 
     * */
    authenticateToken, deleteUserById);


export default userRouter;
