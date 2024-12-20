// Dummy mock data for users
const userItems = [
  {
    user_id: 260,
    username: 'Clarkson',
    password: '********',
    email: 'vchar@example.com',
    user_level_id: 1,
    created_at: '2020-09-12T06:56:41.000Z',
    file_name: 'clarkson.png',
    file_type: 'image/jpeg',
  },
  {
    user_id: 305,
    username: 'May',
    password: '********',
    email: 'dona@example.com',
    user_level_id: 1,
    created_at: '2021-12-11T06:00:41.000Z',
    file_name: 'may.png',
    file_type: 'image/jpeg',
  },
  {
    user_id: 3609,
    username: 'Hammond',
    password: '********',
    email: 'x58df@example.com',
    user_level_id: 3,
    created_at: '2023-04-02T05:56:41.000Z',
    file_name: 'hammond.png',
    file_type: 'image/jpeg',
  },
];

/**
 * Retrieves all user items and sends them as a JSON response.
 * @function
 * @param {Object} req - The request object used to receive HTTP request details.
 * @param {Object} res - The response object used to send the JSON response.
 */
const getUserItems = (req, res) => {
  res.json(userItems);
};

/**
 * Adds a new user item to the userItems array.
 * Logs the request body and assigns a new user ID to the item.
 * Sends a response with the newly created user item's ID.
 * @function
 * @param {Object} req - The request object containing the new user data in the body.
 * @param {Object} res - The response object used to send the response.
 */
const postUserItem = (req, res) => {
  console.log('post req body', req.body);
  const newItem = req.body;
  newItem.user_id = userItems[userItems.length - 1].user_id + 1; // Assign new user ID
  userItems.push(newItem); // Add the new user item to the array
  res.status(201).json({ message: 'Item added', id: newItem.user_id });
};

/**
 * Retrieves a user item by its user ID.
 * If the item is found, it sends the item as a JSON response.
 * If a 'plain' format is requested, it sends the user's username.
 * If the item is not found, it sends a 404 error response.
 * @function
 * @param {Object} req - The request object containing the user ID in the URL parameters.
 * @param {Object} res - The response object used to send the response.
 */
const getUserItemById = (req, res) => {
  const id = parseInt(req.params.id); // Parse user ID from URL parameter
  const item = userItems.find((item) => item.user_id === id); // Find the user item by ID
  if (item) {
    if (req.query.format === 'plain') {
      res.send(item.username); // Send username if 'plain' format is requested
    } else {
      res.json(item); // Send user item as JSON
    }
  } else {
    res.status(404).json({ message: 'User not found' }); // User not found response
  }
};

/**
 * Modifies an existing user item by its user ID.
 * If the item is found, it updates its data with the request body and sends a response indicating success.
 * If the item is not found, it sends a 404 error response.
 * @function
 * @param {Object} req - The request object containing the user ID in the URL parameters and updated data in the body.
 * @param {Object} res - The response object used to send the response.
 */
const modifyUserItem = (req, res) => {
  const id = parseInt(req.params.id); // Parse user ID from URL parameter
  const item = userItems.find((item) => item.user_id === id); // Find the user item by ID
  if (item) {
    const index = userItems.indexOf(item); // Get the index of the user item
    userItems[index] = req.body; // Update the user item data
    res.json({ message: 'Item updated', id: id }); // Send success response
  } else {
    res.status(404).json({ message: 'User not found' }); // User not found response
  }
};

/**
 * Deletes a user item by its user ID.
 * If the item is found, it removes it from the userItems array and sends a success response.
 * If the item is not found, it sends a 404 error response.
 * @function
 * @param {Object} req - The request object containing the user ID in the URL parameters.
 * @param {Object} res - The response object used to send the response.
 */
const deleteUserItem = (req, res) => {
  const id = parseInt(req.params.id); // Parse user ID from URL parameter
  const item = userItems.find((item) => item.user_id === id); // Find the user item by ID
  if (item) {
    const index = userItems.indexOf(item); // Get the index of the user item
    userItems.splice(index, 1); // Remove the user item from the array
    res.json({ message: 'Item deleted', id: id }); // Send success response
  } else {
    res.status(404).json({ message: 'User not found' }); // User not found response
  }
};

export { getUserItems, postUserItem, getUserItemById, userItems, modifyUserItem, deleteUserItem };
