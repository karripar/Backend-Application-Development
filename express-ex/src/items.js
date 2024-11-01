// Dummy mock data
const items = [
  { id: 1, name: 'Item1' },
  { id: 2, name: 'Item2' },
  { id: 5, name: 'Item5' },
];

/**
 * Retrieves all items and sends them as a JSON response.
 * @function
 * @param {Object} res - The response object used to send the JSON response.
 */
const getItems = (res) => {
  res.json(items);
};

/**
 * Adds a new item to the items array.
 * Logs the request body and assigns a new ID to the item.
 * Sends a response with the newly created item's ID.
 * @function
 * @param {Object} req - The request object containing the new item data in the body.
 * @param {Object} res - The response object used to send the response.
 */
const postItem = (req, res) => {
  console.log('post req body', req.body);
  const newItem = req.body;
  newItem.id = items[items.length - 1].id + 1; // Assign new ID
  items.push(newItem); // Add the new item to the items array
  res.status(201).json({ message: 'Item added', id: newItem.id });
};

/**
 * Retrieves an item by its ID.
 * If the item is found, it sends the item as a JSON response.
 * If a 'plain' format is requested, it sends just the item name.
 * If the item is not found, it sends a 404 error response.
 * @function
 * @param {Object} req - The request object containing the item ID in the URL parameters.
 * @param {Object} res - The response object used to send the response.
 */
const getItemById = (req, res) => {
  const id = parseInt(req.params.id); // Parse ID from URL parameter
  const item = items.find((item) => item.id === id); // Find the item by ID
  if (item) {
    if (req.query.format === 'plain') {
      res.send(item.name); // Send item name if 'plain' format is requested
    } else {
      res.json(item); // Send item as JSON
    }
  } else {
    res.status(404).json({ message: 'Item not found' }); // Item not found response
  }
};

export { getItems, postItem, getItemById };
