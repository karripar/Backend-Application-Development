import promisePool from '../utils/database.js';

/**
 *  
 * @returns {Promise<Array>} Promise object represents the array of media items
 * @throws {Error} Database error
 * @async
 */
const fetchMediaItems = async () => {
  try {
    const [rows, structure] = await promisePool.query(
      'SELECT * FROM mediaitems',
    );
    if (rows) {
      console.log('result', rows, structure);
      return rows;
    }
  } catch (e) {
    console.log('fetchMediaItems', e.message);
    throw new Error('Database error' + e.message);
  }
};

/**
 *  
 * @param {number} id - Media ID
 * @returns {Promise<Object>} Promise object represents the media item object
 * @throws {Error} Media item not found
 * @throws {Error} Database error
 * @async
 */
const fetchMediaItemsById = async (id) => {
  try {
    const sql = 'SELECT * FROM mediaitems WHERE media_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    if (rows) {
      return rows[0];
    }
  } catch (e) {
    console.log('fetchMediaItemsById', e.message);
    throw new Error('Database error' + e.message);
  }
};

/**
 *  
 * @param {Object} newItem - Media item object
 * @returns {Promise<number>} Promise object represents the ID of the new media item
 * @throws {Error} Database error
 * @async
 */
const addMediaItem = async (newItem) => {
  const sql = `
                  INSERT INTO mediaitems 
                  (user_id, title, description, filename, filesize, media_type) 
                  VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    newItem.user_id,
    newItem.title,
    newItem.description,
    newItem.filename,
    newItem.filesize,
    newItem.media_type,
  ];
  try {
    const [result] = await promisePool.query(sql, params);
    if (result) {
      console.log('addMediaItem', result);
      return result.insertId;
    }
  } catch (e) {
    console.log('addMediaItem', e.message);
    throw new Error('Database error' + e.message);
  }
};

/**
 *  
 * @param {number} id - Media ID
 * @param {Object} modifiedItem - Modified media item object
 * @returns {Promise<number>} Promise object represents the number of affected rows
 * @throws {Error} Database error
 * @async
 */
const modifyMediaItem = async (media_id, user_id, user_level_id, modifiedItem) => {
  const existingItem = await fetchMediaItemsById(media_id);
  if (!existingItem) {
    throw new Error(`Media item with ID ${media_id} not found.`);
  }
  let sql;
  let params;

  if (user_level_id === 2) {
  sql = `
    UPDATE MediaItems
    SET 
      title = ?, 
      description = ?, 
      filename = ?, 
      filesize = ?, 
      media_type = ?
    WHERE media_id = ?`;

  // Use existing values for fields if they are not provided
  params = [
    modifiedItem.title || existingItem.title,
    modifiedItem.description || existingItem.description,
    modifiedItem.filename || existingItem.filename,
    modifiedItem.filesize || existingItem.filesize,
    modifiedItem.media_type || existingItem.media_type,
    media_id,
    user_id,
  ];
  } else {
    sql = `
    UPDATE MediaItems
    SET 
      title = ?, 
      description = ?, 
      filename = ?, 
      filesize = ?, 
      media_type = ?
    WHERE media_id = ? AND user_id = ?`;
    params = [
      modifiedItem.title || existingItem.title,
      modifiedItem.description || existingItem.description,
      modifiedItem.filename || existingItem.filename,
      modifiedItem.filesize || existingItem.filesize,
      modifiedItem.media_type || existingItem.media_type,
      media_id,];
  }
  try {
    const [result] = await promisePool.query(sql, params);

    if (result.affectedRows === 0) {
      if (user_level_id !== 2) {
        throw new Error('Not authorized to modify this item.');
      } else {
        throw new Error('Media item not found.');
      }
    }

    return result.affectedRows;
  } catch (e) {
    console.error('modifyMediaItem Database error:', e.message);
    throw new Error('Database error: ' + e.message);
  }
};


/**
 *  
 * @param {number} id - Media ID
 * @returns {Promise<Object>} Promise object represents the success of the deletion
 * @throws {Error} Database error
 * @async
 */
const deleteMediaItem = async (id, user_id, user_level_id) => {
  let sql 
  let params
  // admins are level 2
  if (user_level_id === 2) {
    sql = 'DELETE FROM mediaitems WHERE media_id = ?';
    params = [id];
  } else {
    sql = 'DELETE FROM mediaitems WHERE media_id = ? AND user_id = ?';
    params = [id, user_id];
  }
  try {
    const [result] = await promisePool.query(sql, params);

    // Check if the item was deleted
    if (result.affectedRows > 0) {
      console.log('deleteMediaItem', `Deleted media item with ID ${id}`);
      return { success: true };
    } else {
      // If no rows were affected, the item might not exist
      return { success: false, error: 'Media item not found' };
    }
  } catch (e) {
    // Log the error for debugging purposes
    console.log('deleteMediaItem', e.message);
    return { success: false, error: 'Database error: ' + e.message };
  }
};




export {fetchMediaItems, addMediaItem, fetchMediaItemsById, modifyMediaItem, deleteMediaItem};
