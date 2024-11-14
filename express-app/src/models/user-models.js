import promisePool from '../utils/database.js';

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

const fetchUserById = async (id) => {
  try {
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    if (rows) {
      return rows[0];
    }
  } catch (e) {
    console.log('fetchUserById', e.message);
    throw new Error('Database error: ' + e.message);
  }
};

const addUser = async (newUser) => {
  const sql = `
    INSERT INTO users 
    (username, email, password, user_level_id) 
    VALUES (?, ?, ?, ?)`;
  const params = [
    newUser.username,
    newUser.email,
    newUser.password,
    newUser.user_level_id
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

const modifyUser = async (id, modifiedUser) => {
  const sql = `
    UPDATE users
    SET username = ?, email = ?, password = ?, user_level_id = ?
    WHERE user_id = ?`;
  const params = [
    modifiedUser.username,
    modifiedUser.email,
    modifiedUser.password,
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

const deleteUser = async (id) => {
  const sql = 'DELETE FROM users WHERE user_id = ?';
  try {
    const [result] = await promisePool.query(sql, [id]);
    if (result.affectedRows > 0) {
      console.log('deleteUser', `User with ID ${id} was deleted.`);
      return { success: true };
    } else {
      console.log('deleteUser', `User with ID ${id} not found.`);
      return { success: false, error: 'User not found' };
    }
  } catch (e) {
    console.log('deleteUser', e.message);
    return { success: false, error: 'Database error: ' + e.message };
  }
};


export { fetchUsers, fetchUserById, addUser, modifyUser, deleteUser };
