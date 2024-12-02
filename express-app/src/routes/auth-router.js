import express from 'express';
import {getMe, postLogin} from '../controllers/auth-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';
import {body} from 'express-validator';
import { postUser } from '../controllers/user-controller.js';
import { validationErrorHandler } from '../middlewares/error-handler.js';

const authRouter = express.Router();

/**
 * @apiDefine all No authentication needed.
 */

/**
 * @apiDefine token Logged in user access only
 * Valid authentication token must be provided within request.
 */

/**
 * @apiDefine UnauthorizedError
 * @apiError UnauthorizedError User name or password invalid.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": {
 *         "message": "username/password invalid",
 *         "status": 401
 *       }
 *     }
 */

// Out resource endpoints
authRouter.route('/login').post(
  /**
 * @api {post} /login Login
 * @apiVersion 1.0.0
 * @apiName PostLogin
 * @apiGroup Authentication
 * @apiPermission all
 *
 * @apiDescription Sign in and get an authentication token for the user.
 *
 * @apiParam {String} username Username of the user.
 * @apiParam {String} password Password of the user.
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *      "username": "johnd",
 *      "password": "examplepass"
 *    }
 *
 * @apiSuccess {String} token Token for the user authentication.
 * @apiSuccess {Object} user User info.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "Logged in successfully",
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMSwid
 *                XNlcm5hbWUiOiJ1dXNpMSIsImVtYWlsIjoidXVzaTFAZXhhbXBsZS5jb20
 *                iLCJ1c2VyX2xldmVsX2lkIjoyLCJpYXQiOjE3MDEyNzkzMjJ9.3TbVTcXS
 *                dryTDm_huuXC_U1Lg4rL0SOFyn_WAsC6W0Y"
 *      "user": {
 *        "user_id": 21,
 *        "username": "johnd",
 *        "email": "johnd@example.com",
 *        "user_level_id": 2
 *      }
 *    }
 *
 * @apiUse UnauthorizedError
 */
  body('username').isAlphanumeric().isLength({min: 3, max: 20}),
  body('password').isLength({min: 8}),
  validationErrorHandler,
  postLogin);

authRouter.route('/me').get(
  /**
   *  
   * @api {get} /me GetMe
   * @apiVersion 1.0.0
   * @apiName GetMe
   * @apiGroup Authentication
   * @apiPermission token
   * 
   * @apiDescription Get the user info.
   * 
   * @apiSuccess {Object} user User info.
   * 
   * @apiSuccessExample Success-Response:
   * HTTP/1.1 200 OK
   * {
   * "user": {
   * "user_id": 21,
   * "username": "johnd",
   * "email": "
   * "user_level_id": 2
   * }
   * 
   * 
   * @apiUse UnauthorizedError
    * 
    */
  authenticateToken, getMe);


authRouter
  .route('/register')
  .post(
    /**
     * @api {post} /register Register
     * @apiVersion 1.0.0
     * @apiName PostRegister
     * @apiGroup Authentication
     * @apiPermission all
     * 
     * @apiDescription Register a new user.
     * 
     * @apiParam {String} username Username of the user.
     * @apiParam {String} password Password of the user.
     * @apiParam {String} email Email of the user.
     * 
     * @apiParamExample {json} Request-Example:
     *   {
     *    "username": "johnd",
     *   "password": "examplepass",
     *  "email": "
     *  }
     * 
     * @apiSuccess {String} message Message indicating the user was added.
     * @apiSuccess {Number} id ID of the user added.
     * 
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 201 Created
     * {
     * "message": "User added",
     * "id": 21
     * }
     *  
     * @apiUse UnauthorizedError
     * 
     */
    body('username').trim().isAlphanumeric().isLength({min: 3, max: 20}),
    body('password').isLength({min: 8}),
    body('email').isEmail(),
    validationErrorHandler,
    postUser,
  );

export default authRouter;
