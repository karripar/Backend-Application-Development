import promisePool from '../utils/database.js';

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


const fetchRatingsByUserId = async (id) => {
    try {
        const sql = 'SELECT * FROM ratings WHERE user_id = ?';
        const [rows] = await promisePool.query(sql, [id]);
        if (rows) {
            return rows[0];
        }
    } catch (e) {
        console.log('fetchRatingsByUserId', e.message);
        throw new Error('Database error: ' + e.message);
    }
};



const addRating = async (newRating) => {
  const sql = `
        INSERT INTO ratings
        (rating_value, media_id, user_id)
        VALUES (?, ?, ?)`;
  const params = [newRating.rating_value, newRating.media_id, newRating.user_id];
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

export {fetchRatings, fetchRatingById, fetchRatingsByUserId, addRating, modifyRating, deleteRating};