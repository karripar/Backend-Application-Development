import promisePool from '../utils/database.js';

/**
 * 
 * @returns {Promise<Array>} Promise object represents the array of users
 * @throws {Error} Database error
 */
const fetchUsers = async () => {
  try {
    const [rows, structure] = await promisePool.query(
      'SELECT * FROM users'
    );
    if (rows) {
      console.log('fetchUsers', rows, structure);
      return rows;
    }
  } catch (e) {
    console.log('fetchUsers', e.message);
    throw new Error('Database error: ' + e.message);
  }
};

/**
 *  
 * @param {number} id - User ID
 * @returns {Promise<Object>} Promise object represents the user object
 * @throws {Error} User not found
 * @throws {Error} Database error
 */
const fetchUserById = async (id) => {
  
  try {
    const sql = 'SELECT user_id, username, email, user_level_id FROM users WHERE user_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    if (rows && rows.length > 0) {
      return rows[0];
    } else { 
      throw new Error('fetchUserById, User not found');
    }
  } catch (e) {
    console.log('fetchUserById', e.message);
    throw new Error('Database error: ' + e.message);
  }
};

/**
 *  
 * @param {Object} newUser - User object
 * @returns {Promise<number>} Promise object represents the ID of the new user
 * @throws {Error} Duplicate entry, user already exists
 * @throws {Error} Database error
 */
const addUser = async (newUser) => {
  const sql = `
    INSERT INTO users 
    (username, email, password, user_level_id) 
    VALUES (?, ?, ?, ?)`;
  const params = [
    newUser.username,
    newUser.email,
    newUser.password,
    newUser.user_level_id || 1
  ];
  try {
    const [result] = await promisePool.query(sql, params);
    if (result) {
      console.log('addUser', result);
      return result.insertId;
    }
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      console.log('addUser', e.message);
      throw new Error('Duplicate entry, user already exists');
    } else {
      console.log('addUser', e.message);
      throw new Error('Database error: ' + e.message);
    }
  }
};

/**
 *  
 * @param {number} id - User ID
 * @param {Object} modifiedUser - User object
 * @returns {Promise<number>} Promise object represents the number of affected rows
 * @throws {Error} Database error
 * @throws {Error} User not found
 * @throws {Error} Duplicate entry, user already exists
 */
const modifyUser = async (id, modifiedUser) => {
  const sql = `
    UPDATE users
    SET username = ?, email = ?, user_level_id = ?
    WHERE user_id = ?`;
  
  const params = [
    modifiedUser.username,
    modifiedUser.email,
    modifiedUser.user_level_id,
    id
  ];

  try {
    const [result] = await promisePool.query(sql, params);
    if (result) {
      console.log('modifyUser', result);
      return result.affectedRows;
    }
  } catch (e) {
    console.log('modifyUser', e.message);
    throw new Error('Database error: ' + e.message);
  }
};



/**
 *  
 * @param {number} id - User ID
 * @returns {Promise<Object>} Promise object represents the success status
 * @throws {Error} Database error
 * @throws {Error} User not found
 */
const deleteUser = async (id) => {
  const sql = 'DELETE FROM users WHERE user_id = ?';
  try {
    const [result] = await promisePool.query(sql, [id]);
    if (result.affectedRows > 0) {
      console.log('deleteUserById', `User with ID ${id} was deleted.`);
      return { success: true };
    } else {
      console.log('deleteUserById', `User with ID ${id} not found.`);
      return { success: false, error: 'User not found' };
    }
  } catch (e) {
    console.log('deleteUserById', e.message);
    return { success: false, error: 'Database error: ' + e.message };
  }
};



const selectUsernameAndPassword = async (username, password) => {
  // TODO return only user_id
  const sql = 'SELECT user_id, username, email, user_level_id, created_at FROM users WHERE username = ? AND password = ?';
  try {
    const [rows] = await promisePool.query(sql, [username, password]);
    if (rows) {
      return rows[0];
    } else {
      throw new Error('selectUsernameAndPassword, User not found');
    }
  } catch (e) {
    console.log('selectUsernameAndPassword', e.message);
    throw new Error('Database error: ' + e.message);
  }
};


const checkUsernameOrEmailExists = async (username, email, userId) => {
  const sql = `
    SELECT user_id 
    FROM users 
    WHERE (username = ? OR email = ?) AND user_id != ?`;
  try {
    const [rows] = await promisePool.query(sql, [username, email, userId]);
    return rows.length > 0; // Return true if a conflict is found
  } catch (e) {
    console.error('checkUsernameOrEmailExists', e.message);
    throw new Error('Database error: ' + e.message);
  }
};



export { fetchUsers, fetchUserById, addUser, modifyUser, deleteUser, selectUsernameAndPassword, checkUsernameOrEmailExists };
