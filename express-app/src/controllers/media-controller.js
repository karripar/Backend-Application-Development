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
    user_id: 1,
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
 * @function
 * @param {Object} req - The request object containing the media ID in the URL parameters.
 * @param {Object} res - The response object used to send the response.
 */
const deleteItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await deleteMediaItem(id);
    if (result.success) {
      res.status(200).json({message: 'Item deleted', id: id});
    } else if (result.error === 'Item not found') {
      res.status(404).json({message: 'Item not found'});
    } else {
      res.status(500).json({message: result.error});
    }
  } catch (e) {
    console.error('deleteItem', e.message);
    res.status(500).json({message: 'Error in deleteItem database query'});
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
const modifyItem = async (req, res) => {
  try {
  const id = parseInt(req.params.id);
  const modifiedItem = {
    title: req.body.title,
    description: req.body.description,
    filename: req.body.filename,
    filesize: req.body.filesize,
    media_type: req.body.media_type,
  };
  const result = await modifyMediaItem(id, modifiedItem);
  if (result) {
    res.status(200).json({message: 'Item modified', id: id});
  } else {
    res.status(404).json({message: 'Item not found'});
  }
} catch (e) {
  console.error('modifyItem', e.message);
  res.status(500).json({message: 'Error in modifyItem database query'});
}

};

export {getItems, postItem, getItemById, deleteItem, modifyItem};
