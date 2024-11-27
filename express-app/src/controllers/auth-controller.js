import jwt from 'jsonwebtoken';
import {fetchUserById, selectUserByUsername} from '../models/user-models.js';
import 'dotenv/config';
import {customError} from '../middlewares/error-handler.js';
import bcrypt from 'bcryptjs';

const postLogin = async (req, res, next) => {
  try {
    console.log('postLogin', req.body);
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return next(customError('Username and password are required', 400));
    }

    // Fetch user from the database
    const user = await selectUserByUsername(username);

    // Check if user exists
    if (!user) {
      return next(customError('Invalid username', 401));
    }

    // Compare passwords
    const checkBcrypt = await bcrypt.compare(password, user.password);
    if (!checkBcrypt) {
      return next(customError('Invalid password', 401));
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id, user_level_id: user.user_level_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIRES_IN },
    );

    // Respond with user details and token
    res.json({ ...user, token });
  } catch (error) {
    next(error); // Pass unexpected errors to the error handler middleware
  }
};


const getMe = async (req, res, next) => {
  try {
    const user = await fetchUserById(req.user.user_id);
    if (user) {
      res.json({user_id: req.user.user_id, ...user});
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    return next(customError(e.message, 503));
  }
};

export {postLogin, getMe};
