import {
  fetchMediaItems,
  addMediaItem,
  fetchMediaItemsById,
  deleteMediaItem,
  modifyMediaItem,
} from '../models/media-model.js';
import { customError } from '../middlewares/error-handler.js';
/**
 * Retrieves all media items from the database and sends them as a JSON response.
 * @function
 * @param {Object} res - The response object used to send the JSON response.
 */
const getItems = async (req, res, next) => {
  try {
    res.json(await fetchMediaItems());
  } catch (e) {
    console.error('getItems', e.message);
    return next(customError('Error in getItems database query', 500));    
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
const postItem = async (req, res, next) => {
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
      return next(customError('Item not added: failure', 400));
    }
  } catch (e) {
    console.error('postItem', e.message);
    return next(customError('Error in postItem database query', 500));
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
const getItemById = async (req, res, next) => {
  // TODO: Implement the try-catch block for db errors
  try {
    const id = parseInt(req.params.id); // Parse media ID from URL parameter
    const item = await fetchMediaItemsById(id);
    if (item) {
      res.json(item);
    } else {
      return next(customError('Media item not found', 404));
    }
  } catch (e) {
    console.error('getItemById', e.message);
    return next(customError('Error in getItemById database query', 500));
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
const deleteItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const item = await fetchMediaItemsById(id);

    // Step 1: Check if the item exists
    if (!item) {
      return next(customError('Media item not found', 404));
    }

    // Step 2: Check if the user owns the media item
    if (item.user_id !== req.user.user_id) {
      return next(customError('You can only delete your own media items', 403));
    }

    // Step 3: Proceed with the deletion
    const result = await deleteMediaItem(id, req.user.user_id, req.user.user_level_id);
    if (result.success) {
      return res.status(200).json({ message: 'Item deleted successfully', id });
    } else {
      return next(customError('Failed to delete media item', 500));
    }
  } catch (e) {
    console.error('deleteItem', e.message);
    return next(customError('Error in deleteItem database query', 500));
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
const modifyItem = async (req, res, next) => {
  const { title, description } = req.body;
  console.log('PUT request body:', req.body);

  const newDetails = { title, description };

  try {
    const item = await fetchMediaItemsById(req.params.id);

    if (!item) {
      return next(customError('Media item not found', 404));
    }

    // Check permissions: Admin can modify any item, regular users can modify only their own
    if (req.user.user_level === 2 || item.user_id === req.user.user_id) {
      const itemsEdited = await modifyMediaItem(req.params.id, req.user.user_id, req.user.user_level_id, newDetails);

      if (itemsEdited === 0) {
        return next(customError('Media item not found or no changes were made', 404));
      } else {
        res.status(200).json({ message: 'Item updated successfully', id: req.params.id });
      }
    } else {
      return next(customError('You can only modify your own media items', 403));
    }
  } catch (e) {
    console.error('modifyItem Error:', e.message);
    return next(customError('Error in modifyItem database query', 500));
  }
};


export {getItems, postItem, getItemById, deleteItem, modifyItem};
