import {
  fetchUsers,
  addUser,
  fetchUserById,
  deleteUser,
  modifyUser,
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
    password: req.body.password, // Ensure hashing in actual implementation
    user_level: req.body.user_level,
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
    const result = await deleteUser(id);

    if (result.success) {
      res.status(200).json({ message: `User with ID ${id} was deleted.` });
    } else if (result.error === 'User not found') {
      res.status(404).json({ message: `User with ID ${id} not found.` });
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (e) {
    console.error('deleteUserById', e.message);
    res.status(500).json({ message: 'Error in deleteUserById database query' });
  }
};


/**
 * Modifies an existing user by their ID.
 * If the user is found, it updates their data and sends a response indicating success.
 * If the user is not found, it sends a 404 error response.
 * @function
 * @param {Object} req - The request object containing the user ID in the URL parameters and updated data in the body.
 * @param {Object} res - The response object used to send the response.
 */
const modifyUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const modifiedUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      user_level_id: req.body.user_level_id,
    };
    const result = await modifyUser(id, modifiedUser);
    if (result) {
      res.status(200).json({message: 'User modified', id: id});
    } else {
      res.status(404).json({message: 'User not found'});
    }
  } catch (e) {
    console.error('modifyUserById', e.message);
    res.status(500).json({message: 'Error in modifyUserById database query'});
  }
};

export {getUsers, postUser, getUserById, deleteUserById, modifyUserById};
