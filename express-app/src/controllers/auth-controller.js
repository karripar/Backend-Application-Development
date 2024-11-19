import jwt from 'jsonwebtoken';
import {fetchUserById, selectUsernameAndPassword} from '../models/user-models.js';
import 'dotenv/config';

const postLogin = async (req, res) => {
  console.log('postLogin', req.body);
  const {username, password} = req.body;
  const user = await selectUsernameAndPassword(username, password);
  if (user) {
    const token = jwt.sign({user_id: user.user_id, user_level_id: user.user_level_id}, process.env.JWT_SECRET, {expiresIn: process.env.EXPIRES_IN});
    res.json({...user, token});
  } else {
    res.sendStatus(401);
  }
};

const getMe = async (req, res) => {
  try {
  const user = await fetchUserById(req.user.user_id);
  if (user) {
    res.json({user_id: req.user.user_id, ...user});
  } else {
    res.sendStatus(401);
  } 
} catch (e) {
  console.error('getMe', e.message);
  res.status(503).json({message: 'Error in getMe'});
};
}

export {postLogin, getMe};