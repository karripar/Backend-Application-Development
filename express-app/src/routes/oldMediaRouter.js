/*Media router used in the previous version of the application. (before express and database implementation)*/


/**
 * Route to get a media item by ID.
 * @function
 * @param {Object} req - The request object containing the media ID in the URL.
 * @param {Object} res - The response object.
 */
mediaRouter.get('/:id', (req, res) => {
    getItemById(req, res);
  });
  
  /**
   * Route to create a new media item.
   * @function
   * @param {Object} req - The request object containing the new media data in the body.
   * @param {Object} res - The response object.
   */
  mediaRouter.post('/', (req, res) => {
    postItem(req, res);
  });
  
  /**
   * Route to update an existing media item by ID.
   * @function
   * @param {Object} req - The request object containing the media ID in the URL and updated data in the body.
   * @param {Object} res - The response object.
   */
  mediaRouter.put('/:id', (req, res) => {
    modifyItem(req, res);
  });
  