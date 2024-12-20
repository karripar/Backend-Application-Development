// Dummy mock data
const mediaItems = [
  {
    media_id: 9632,
    filename: 'kissa3.png',
    filesize: 887574,
    title: 'Favorite drink',
    description: '',
    user_id: 1606,
    media_type: 'image/jpeg',
    created_at: '2023-10-16T19:00:09.000Z',
  },
  {
    media_id: 9626,
    filename: 'kissa2.png',
    filesize: 60703,
    title: 'Miika',
    description: 'My Photo',
    user_id: 3671,
    media_type: 'image/jpeg',
    created_at: '2023-10-13T12:14:26.000Z',
  },
  {
    media_id: 9625,
    filename: 'kissa.png',
    filesize: 30635,
    title: 'Aksux',
    description: 'friends',
    user_id: 260,
    media_type: 'image/jpeg',
    created_at: '2023-10-12T20:03:08.000Z',
  },
  {
    media_id: 9592,
    filename: 'f504.jpg',
    filesize: 48975,
    title: 'Desert',
    description: '',
    user_id: 3609,
    media_type: 'image/jpeg',
    created_at: '2023-10-12T06:59:05.000Z',
  },
  {
    media_id: 9590,
    filename: '60ac.jpg',
    filesize: 23829,
    title: 'Basement',
    description: 'Light setup in basement',
    user_id: 305,
    media_type: 'image/jpeg',
    created_at: '2023-10-12T06:56:41.000Z',
  },
];

/**
 * Retrieves all media items and sends them as a JSON response.
 * @function
 * @param {Object} res - The response object used to send the JSON response.
 */
const getItems = (res) => {
  res.json(mediaItems);
};

/**
 * Adds a new media item to the mediaItems array.
 * Logs the request body and assigns a new media ID to the item.
 * Sends a response with the newly created media item's ID.
 * @function
 * @param {Object} req - The request object containing the new media data in the body.
 * @param {Object} res - The response object used to send the response.
 */
const postItem = (req, res) => {
  console.log('post req body', req.body);
  const newItem = req.body;
  newItem.media_id = mediaItems[mediaItems.length - 1].media_id + 1; // Assign new media ID
  mediaItems.push(newItem); // Add the new media item to the array
  res.status(201).json({ message: 'Item added', id: newItem.media_id });
};

/**
 * Retrieves a media item by its media ID.
 * If the item is found, it sends the item as a JSON response.
 * If a 'plain' format is requested, it sends just the item title.
 * If the item is not found, it sends a 404 error response.
 * @function
 * @param {Object} req - The request object containing the media ID in the URL parameters.
 * @param {Object} res - The response object used to send the response.
 */
const getItemById = (req, res) => {
  const id = parseInt(req.params.id); // Parse media ID from URL parameter
  const item = mediaItems.find((item) => item.media_id === id); // Find the media item by ID
  if (item) {
    if (req.query.format === 'plain') {
      res.send(item.title); // Send media title if 'plain' format is requested
    } else {
      res.json(item); // Send media item as JSON
    }
  } else {
    res.status(404).json({ message: 'Item not found' }); // Item not found response
  }
};

/**
 * Deletes a media item by its media ID.
 * If the item is found, it removes it from the mediaItems array and sends a 204 No Content response.
 * If the item is not found, it sends a 404 error response.
 * @function
 * @param {Object} req - The request object containing the media ID in the URL parameters.
 * @param {Object} res - The response object used to send the response.
 */
const deleteItem = (req, res) => {
  const id = parseInt(req.params.id); // Parse media ID from URL parameter
  const index = mediaItems.findIndex((item) => item.media_id === id); // Find index of the media item
  if (index !== -1) {
    mediaItems.splice(index, 1); // Remove the media item from the array
    res.status(204).send(); // Send No Content response
  } else {
    res.status(404).json({ message: 'Item not found' }); // Item not found response
  }
};

/**
 * Modifies an existing media item by its media ID.
 * If the item is found, it updates its data with the request body and sends a response indicating success.
 * If the item is not found, it sends a 404 error response.
 * @function
 * @param {Object} req - The request object containing the media ID in the URL parameters and updated data in the body.
 * @param {Object} res - The response object used to send the response.
 */
const modifyItem = (req, res) => {
  const id = parseInt(req.params.id); // Parse media ID from URL parameter
  const item = mediaItems.find((item) => item.media_id === id); // Find the media item by ID
  if (item) {
    const index = mediaItems.indexOf(item); // Get the index of the media item
    mediaItems[index] = req.body; // Update the media item data
    res.json({ message: 'Item updated', id: id }); // Send success response
  } else {
    res.status(404).json({ message: 'Item not found' }); // Item not found response
  }
};

export { getItems, postItem, getItemById, mediaItems, deleteItem, modifyItem };
