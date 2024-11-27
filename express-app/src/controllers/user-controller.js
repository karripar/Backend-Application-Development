import { customError } from '../middlewares/error-handler.js';
import {
  fetchUsers,
  addUser,
  fetchUserById,
  deleteUser,
  modifyUser,
  checkUsernameOrEmailExists
} from '../models/user-models.js';
import bcrypt from 'bcryptjs';

/**
 * Retrieves all users from the database and sends them as a JSON response.
 * @function
 * @param {Object} res - The response object used to send the JSON response.
 */
const getUsers = async (req, res, next) => {
  try {
    res.json(await fetchUsers());
  } catch (e) {
    console.error('getUsers', e.message);
    return next(customError('Error in getUsers database query', 500));
  }
};

/**
 * Adds a new user to the database.
 * Sends a response with the newly created user's ID.
 * @function
 * @param {Object} req - The request object containing the new user data in the body.
 * @param {Object} res - The response object used to send the response.
 */
const postUser = async (req, res, next) => {
  const newUser = req.body;
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
  console.log('Hash', newUser.password);
  try {
    const newId = await addUser(newUser);
    if (newId) {
      res.status(201).json({message: 'User added', id: newId});
    } else {
      return next(customError('User not added: failure', 400));
    }
  } catch (e) {
    if (e.message === 'Duplicate entry, user already exists') {
      return next(customError('User not added: User already exists', 400));
    } else {
      console.error('postUser', e.message);
      return next(customError('Error in postUser database query', 500));
    }
  }
};

/**
 * Retrieves a user by their ID.
 * If the user is found, it sends the user as a JSON response.
 * If the user is not found, it sends a 404 error response.
 * @function
 * @param {Object} req - The request object containing the user ID in the URL parameters.
 * @param {Object} res - The response object used to send the response.
 */
const getUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const user = await fetchUserById(id);
    if (user) {
      res.json(user);
    } else {
      return next(customError('User not found', 404));
    }
  } catch (e) {
    console.error('getUserById', e.message);
    return next(customError('Error in getUserById database query', 500));
  }
};

/**
 * Deletes a user by their ID.
 * If the user is found, it deletes them and sends a 204 No Content response.
 * If the user is not found, it sends a 404 error response.
 * @function
 * @param {Object} req - The request object containing the user ID in the URL parameters.
 * @param {Object} res - The response object used to send the response.
 */
const deleteUserById = async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const user = await fetchUserById(id);
  
      // Step 1: Check if the user exists
      if (!user) {
        return next(customError('User not found', 404));
      }
  
      // Step 2: Check if the user is authorized to delete
      // Admin can delete any user, regular user can only delete their own account
      if (req.user.user_level_id !== 2 && user.user_id !== req.user.user_id) {
        return next(customError('You can only delete your own account', 403));
      }
  
      // Step 3: Proceed with the deletion
      const result = await deleteUser(id);
      if (result.success) {
        res.status(204).json({ message: 'User deleted', id });
      } else {
        return next(customError('Failed to delete user', 500));
      }
    } catch (e) {
      console.error('deleteUser', e.message);
      return next(customError('Error in deleteUser database query', 500));
    }
  };  


/**
 * Modifies an existing user by their ID.
 * If the user is found, it updates their data and sends a response indicating success.
 * If the user is not found, it sends a 404 error response.
 * If the user is not the user making the request, it sends a 403 error response.
 * @function
 * @param {Object} req - The request object containing the user ID in the URL parameters and updated data in the body.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} - A JSON response indicating whether the user was modified successfully.
 * @throws {Object} - A JSON response indicating that the user was not found.
 * @throws {Object} - A JSON response indicating that the user can only modify their own user.
 */
const modifyUserById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const modifiedUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    user_level_id: req.body.user_level_id,
  };

  try {
    // Fetch the user to validate ownership
    const item = await fetchUserById(id);
    if (!item) {
      return next(customError('User not found', 404));
    }

    // Check if the requesting user is allowed to modify this user
    if (item.user_id !== req.user.user_id && req.user.user_level_id !== 2) {
      return next(customError('You can only modify your own user', 403));
    }

    // Check if the new username or email already exists for another user
    const isConflict = await checkUsernameOrEmailExists(modifiedUser.username, modifiedUser.email, id);
    if (isConflict) {
      return next(customError('Username or email already exists', 409));
    }

    // Update the user
    const result = await modifyUser(id, modifiedUser);
    if (result > 0) {
      res.status(200).json({ message: 'User modified', id });
    } else {
      return next(customError('User not found', 404));
    }
  } catch (e) {
    console.error('modifyUserById', e.message);
    return next(customError('Error in modifyUserById database query', 500));
  }
};






export {getUsers, postUser, getUserById, deleteUserById, modifyUserById};
