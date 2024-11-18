import express from 'express';
import { getMe, postLogin } from '../controllers/auth-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';


const authRouter = express.Router();

// Out resource endpoints
authRouter.route('/login').post(postLogin);
authRouter.route('/me').get(authenticateToken, getMe);

export default authRouter;