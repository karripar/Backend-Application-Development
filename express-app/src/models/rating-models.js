import promisePool from '../utils/database.js';

/**
 *  
 * @returns {Promise<Array>} Promise object represents the array of ratings
 * @throws {Error} Database error
 * @async
 */
const fetchRatings = async () => {
  try {
    const [rows, structure] = await promisePool.query('SELECT * FROM ratings');
    if (rows) {
      console.log('fetchRatings', rows, structure);
      return rows;
    }
  } catch (e) {
    console.log('fetchRatings', e.message);
    throw new Error('Database error: ' + e.message);
  }
};

/**
 *  
 * @param {number} id - Rating ID
 * @returns {Promise<Object>} Promise object represents the rating object
 * @throws {Error} Rating not found
 * @throws {Error} Database error
 * @async
 */
const fetchRatingById = async (id) => {
  try {
    const sql = 'SELECT * FROM ratings WHERE rating_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    if (rows) {
      return rows[0];
    }
  } catch (e) {
    console.log('fetchRatingById', e.message);
    throw new Error('Database error: ' + e.message);
  }
};

/**
 *  
 * @param {number} id - User ID
 * @returns {Promise<Array>} Promise object represents the array of ratings
 * @throws {Error} Database error
 * @async
 */
const fetchRatingsByUserId = async (id) => {
  try {
    const sql = 'SELECT * FROM ratings WHERE user_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    if (rows) {
      console.log('fetchRatingsByUserId', rows);
      return rows;
    }
  } catch (e) {
    console.log('fetchRatingsByUserId', e.message);
    throw new Error('Database error: ' + e.message);
  }
};


/**
 *  
 * @param {number} id - Media ID
 * @returns {Promise<Array>} Promise object represents the array of ratings
 * @throws {Error} Database error
 * @async
 */
const fetchRatingsByMediaId = async (id) => {
  try {
    const sql = 'SELECT * FROM ratings WHERE media_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    if (rows) {
      console.log('fetchRatingsByMediaId', rows);
      return rows;
    }
  } catch (e) {
    console.log('fetchRatingsByMediaId', e.message);
    throw new Error('Database error: ' + e.message);
  }
};

/**
 *  
 * @param {Object} newRating - Rating object
 * @returns {Promise<number>} Promise object represents the ID of the new rating
 * @throws {Error} Duplicate entry, rating already exists
 * @throws {Error} Database error
 * @async
 */
const addRating = async (newRating) => {
  const sql = `
        INSERT INTO ratings
        (rating_value, media_id, user_id)
        VALUES (?, ?, ?)`;
  const params = [
    newRating.rating_value,
    newRating.media_id,
    newRating.user_id,
  ];
  try {
    const [result] = await promisePool.query(sql, params);
    if (result) {
      console.log('addRating', result);
      return result.insertId;
    }
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      console.log('addRating', e.message);
      throw new Error('Duplicate entry, rating already exists');
    } else {
      console.log('addRating', e.message);
      throw new Error('Database error: ' + e.message);
    }
  }
};

/**
 *  
 * @param {number} id - Rating ID
 * @param {Object} modifiedRating - Rating object
 * @returns {Promise<boolean>} Promise object represents the success of the operation
 * @throws {Error} Database error
 * @async
 */
const modifyRating = async (id, modifiedRating) => {
  const sql = `
        UPDATE ratings
        SET rating_value = ?
        WHERE rating_id = ?`;
  const params = [modifiedRating.rating_value, id];
  try {
    const [result] = await promisePool.query(sql, params);
    if (result) {
      console.log('modifyRating', result);
      return result.affectedRows > 0;
    }
  } catch (e) {
    console.log('modifyRating', e.message);
    throw new Error('Database error: ' + e.message);
  }
};

/**
 *  
 * @param {number} id - Rating ID
 * @returns {Promise<boolean>} Promise object represents the success of the operation
 * @throws {Error} Database error
 * @async
 */
const deleteRating = async (id) => {
  const sql = 'DELETE FROM ratings WHERE rating_id = ?';
  try {
    const [result] = await promisePool.query(sql, [id]);
    if (result.affectedRows > 0) {
      console.log('deleteRating', 'Deleted rating with ID', id);
      return {success: true};
    } else {
      console.log('deleteRating', `Rating with ID ${id} not found`);
      return {success: false, error: 'Rating not found'};
    }
  } catch (e) {
    console.log('deleteRating', e.message);
    throw new Error('Database error: ' + e.message);
  }
};

export {
  fetchRatings,
  fetchRatingById,
  fetchRatingsByMediaId,
  fetchRatingsByUserId,
  addRating,
  modifyRating,
  deleteRating,
};
