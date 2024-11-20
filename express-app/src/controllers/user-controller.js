import {
  fetchUsers,
  addUser,
  fetchUserById,
  deleteUser,
  modifyUser,
  checkUsernameOrEmailExists
} from '../models/user-models.js';

/**
 * Retrieves all users from the database and sends them as a JSON response.
 * @function
 * @param {Object} res - The response object used to send the JSON response.
 */
const getUsers = async (req, res) => {
  try {
    res.json(await fetchUsers());
  } catch (e) {
    console.error('getUsers', e.message);
    res.status(500).json({message: 'Error in getUsers'});
  }
};

/**
 * Adds a new user to the database.
 * Sends a response with the newly created user's ID.
 * @function
 * @param {Object} req - The request object containing the new user data in the body.
 * @param {Object} res - The response object used to send the response.
 */
const postUser = async (req, res) => {
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    user_level_id: req.body.user_level_id,
  };

  try {
    const newId = await addUser(newUser);
    if (newId) {
      res.status(201).json({message: 'User added', id: newId});
    } else {
      res.status(400).json({message: 'User not added: failure'});
    }
  } catch (e) {
    if (e.message === 'Duplicate entry, user already exists') {
      res.status(400).json({message: 'User not added: User already exists.'});
    } else {
      console.error('postUser', e.message);
      res.status(500).json({message: 'Error in postUser database query'});
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
const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await fetchUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({message: 'User not found'});
    }
  } catch (e) {
    console.error('getUserById', e.message);
    res.status(500).json({message: 'Error in getUserById database query'});
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
const deleteUserById = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await fetchUserById(id);
  
      // Step 1: Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Step 2: Check if the user is authorized to delete
      // Admin can delete any user, regular user can only delete their own account
      if (req.user.user_level_id !== 2 && user.user_id !== req.user.user_id) {
        return res.status(403).json({ message: 'You can only delete your own account' });
      }
  
      // Step 3: Proceed with the deletion
      const result = await deleteUser(id);
      if (result.success) {
        return res.status(200).json({ message: `User with ID ${id} was deleted.` });
      } else {
        return res.status(500).json({ message: 'Failed to delete user' });
      }
    } catch (e) {
      console.error('deleteUser', e.message);
      res.status(500).json({ message: 'Error in deleteUser database query' });
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
const modifyUserById = async (req, res) => {
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
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the requesting user is allowed to modify this user
    if (item.user_id !== req.user.user_id && req.user.user_level_id !== 2) {
      return res.status(403).json({ message: 'Only admins can modify other users.' });
    }

    // Check if the new username or email already exists for another user
    const isConflict = await checkUsernameOrEmailExists(modifiedUser.username, modifiedUser.email, id);
    if (isConflict) {
      return res.status(409).json({ message: 'Username or email is already taken' });
    }

    // Update the user
    const result = await modifyUser(id, modifiedUser);
    if (result > 0) {
      res.status(200).json({ message: 'User modified', id });
    } else {
      res.status(500).json({ message: 'Failed to modify user' });
    }
  } catch (e) {
    console.error('modifyUserById', e.message);
    res.status(500).json({ message: 'Error in modifyUserById database query' });
  }
};






export {getUsers, postUser, getUserById, deleteUserById, modifyUserById};
