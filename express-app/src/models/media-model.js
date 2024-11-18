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
const modifyMediaItem = async (media_id, user_id, modifiedItem) => {
  const sql = `
  UPDATE MediaItems
  SET title = ?, description = ?, filename = ?, filesize = ?, media_type = ?
  WHERE media_id = ? AND user_id = ?`;
  const params = [
    modifiedItem.title, 
    modifiedItem.description,
    modifiedItem.filename,
    modifiedItem.filesize,
    modifiedItem.media_type,
    media_id,
    user_id
  ]

  try {
    const [result] = await promisePool.query(sql, params);
    if (result) {
      console.log('modifyMediaItem', result);
      return result.affectedRows;
    }
  } catch (e) {
    console.log('modifyMediaItem', e.message);
    throw new Error('Database error' + e.message);
  }
}

/**
 *  
 * @param {number} id - Media ID
 * @returns {Promise<Object>} Promise object represents the success of the deletion
 * @throws {Error} Database error
 * @async
 */
const deleteMediaItem = async (id) => {
  const sql = 'DELETE FROM mediaitems WHERE media_id = ?';
  try {
    const [result] = await promisePool.query(sql, [id]);
    if (result.affectedRows > 0) {
      console.log('deleteMediaItem', `Deleted media item with ID ${id}`);
      return {success: true};
    } else {
      return {success: false, error: 'Media item not found'};
    }
  } catch (e) {
    console.log('deleteMediaItem', e.message);
    return {success: false, error : 'Database error' + e.message};
  }
}



export {fetchMediaItems, addMediaItem, fetchMediaItemsById, modifyMediaItem, deleteMediaItem};
