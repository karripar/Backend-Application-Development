const userItems = [
    {
      user_id: 260,
      username: 'Clarkson',
      password: '********',
      email: 'vchar@example.com',
      user_level_id: 1,
      created_at: '2020-09-12T06:56:41.000Z',
      file_name: 'clarkson.png',
      file_type: 'image/jpeg',
    },
    {
      user_id: 305,
      username: 'May',
      password: '********',
      email: 'dona@example.com',
      user_level_id: 1,
      created_at: '2021-12-11T06:00:41.000Z',
      file_name: 'may.png',
      file_type: 'image/jpeg',
    },
    {
      user_id: 3609,
      username: 'Hammond',
      password: '********',
      email: 'x58df@example.com',
      user_level_id: 3,
      created_at: '2023-04-02T05:56:41.000Z',
      file_name: 'hammond.png',
      file_type: 'image/jpeg',
    },
  ];

const getUserItems = (req, res) => {
    res.json(userItems);
};

const postUserItem = (req, res) => {
    console.log('post req body', req.body);
    const newItem = req.body;
    newItem.user_id = userItems[userItems.length - 1].user_id + 1;
    userItems.push(newItem);
    res.status(201).json({message: 'Item added', id: newItem.user_id});
  };

const getUserItemById = (req, res) => {
    const id = parseInt(req.params.id);
    const item = userItems.find((item) => item.user_id === id);
    if (item) {
      if (req.query.format === 'plain') {
        res.send(item.title);
      } else {
        res.json(item);
      }
    } else {
      res.status(404).json({message: 'User not found'});
    }
  };


const modifyUserItem = (req, res) => { 
    const id = parseInt(req.params.id);
    const item = userItems.find((item) => item.user_id === id);
    if (item) {
      const index = userItems.indexOf(item);
      userItems[index] = req.body;
      res.json({message: 'Item updated', id: id});
    } else {
      res.status(404).json({message: 'User not found'});
    }
  };


const deleteUserItem = (req, res) => {
    const id = parseInt(req.params.id);
    const item = userItems.find((item) => item.user_id === id);
    if (item) {
      const index = userItems.indexOf(item);
      userItems.splice(index, 1);
      res.json({message: 'Item deleted', id: id});
    } else {
      res.status(404).json({message: 'User not found'});
    }
  };



  export {getUserItems, postUserItem, getUserItemById, userItems, modifyUserItem, deleteUserItem};