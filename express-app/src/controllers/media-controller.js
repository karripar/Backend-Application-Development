import {
  fetchMediaItems,
  addMediaItem,
  fetchMediaItemsById,
  deleteMediaItem,
  modifyMediaItem,
} from '../models/media-model.js';
/**
 * Retrieves all media items from the database and sends them as a JSON response.
 * @function
 * @param {Object} res - The response object used to send the JSON response.
 */
const getItems = async (req, res) => {
  try {
    res.json(await fetchMediaItems());
  } catch (e) {
    console.error('getItems', e.message);
    res.status(500).json({message: 'Error in getItems'});
  }
};

/**
 * Adds a new media item to the mediaItems array.
 * Logs the request body and assigns a new media ID to the item.
 * Sends a response with the newly created media item's ID.
 * @function
 * @param {Object} req - The request object containing the new media data in the body.
 * @param {Object} res - The response object used to send the response.
 */
const postItem = async (req, res) => {
  console.log('post req body', req.body);
  console.log('post req file', req.file);
  // Add the new media item to the array
  const newMediaItem = {
    user_id: req.user.user_id,
    title: req.body.title,
    description: req.body.description,
    filename: req.file.filename,
    filesize: req.file.size,
    media_type: req.file.mimetype,
    created_at: new Date().toISOString(),
  };
  try {
    const newId = await addMediaItem(newMediaItem);
    if (newId) {
      res.status(201).json({message: 'Item added', ...newId});
    } else {
      res.status(400).json({message: 'Item not added: failure'});
    }
  } catch (e) {
    console.error('postItem', e.message);
    res.status(500).json({message: 'Error in postItem database query'});
  }
};

/**
 * Retrieves a media item by its media ID.
 * If the item is found, it sends the item as a JSON response.
 * If a 'plain' format is requested, it sends just the item title.
 * If the item is not found, it sends a 404 error response.
 *
 * @function
 * @param {Object} req - The request object containing the media ID in the URL parameters.
 * @param {Object} res - The response object used to send the response.
 */
const getItemById = async (req, res) => {
  // TODO: Implement the try-catch block for db errors
  try {
    const id = parseInt(req.params.id); // Parse media ID from URL parameter
    const item = await fetchMediaItemsById(id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({message: 'Item not found'});
    }
  } catch (e) {
    console.error('getItemById', e.message);
    res.status(500).json({message: 'Error in getItemById database query'});
  }
};

/**
 * Deletes a media item by its media ID.
 * If the item is found, it removes it from the mediaItems array and sends a 204 No Content response.
 * If the item is not found, it sends a 404 error response.
 * If the user is not the owner of the item, it sends a 403 error response.
 * @function
 * @param {Object} req - The request object containing the media ID in the URL parameters.
 * @param {Object} res - The response object used to send the response.
 */
const deleteItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await fetchMediaItemsById(id);

    if (item && item.user_id === req.user.user_id) {
      const result = await deleteMediaItem(id);
      if (result.success) {
        res.status(200).json({ message: 'Item deleted', id });
      } else if (result.error === 'Media item not found') {
        res.status(404).json({ message: 'Media item not found' });
      }
    } else {
      res.status(403).json({ message: 'You can only delete your own media items' });
    }
  } catch (e) {
    console.error('deleteItem', e.message);
    res.status(500).json({ message: 'Error in deleteItem database query' });
  }
};
/**
 * Modifies an existing media item by its media ID.
 * If the item is found, it updates its data with the request body and sends a response indicating success.
 * If the item is not found, it sends a 404 error response.
 * If the user is not the owner of the item, it sends a 403 error response.
 * @function
 * @param {Object} req - The request object containing the media ID in the URL parameters and updated data in the body.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} - A JSON response indicating whether the media item was modified successfully.
 * @throws {Object} - A JSON response indicating that the media item was not found.
 * @throws {Object} - A JSON response indicating that the user can only modify their own media items.
 */
const modifyItem = async (req, res) => {
  const { title, description } = req.body;
  console.log('put req body', req.body);

  const newDetails = { title, description };

  try {
    const item = await fetchMediaItemsById(req.params.id);

    if (item && item.user_id === req.user.user_id) {
      const itemsEdited = await modifyMediaItem(req.params.id, req.user.user_id, newDetails);
      if (itemsEdited === 0) {
        res.status(404).json({ message: 'Media Item not found or no permission to edit' });
      } else {
        res.status(200).json({ message: 'Item updated', id: req.params.id });
      }
    } else {
      res.status(403).json({ message: 'You can only modify your own media items' });
    }
  } catch (e) {
    console.error('modifyItem', e.message);
    res.status(500).json({ message: 'Error in modifyItem database query' });
  }
};

export {getItems, postItem, getItemById, deleteItem, modifyItem};
