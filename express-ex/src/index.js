import express from 'express';
import { getItemById, getItems, postItem, mediaItems, modifyItem } from './media.js';
import { userItems, getUserItemById, getUserItems, postUserItem, modifyUserItem, deleteUserItem } from './users.js';
import { mediaDocs, userDocs } from './docs.js';

const hostname = '127.0.0.1';
const port = 3000;
const app = express();

app.set('view engine', 'pug');
app.set('views', 'src/views');

app.use(express.json());

// Serve static files (HTML, CSS, JS) from the public directory
app.use(express.static('public'));

// Serve uploaded media files
app.use('/media', express.static('media'));
// Serve user-related media files
app.use('/users', express.static('media'));

/**
 * Route to render API documentation for media endpoints.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get('/api/app/media', (req, res) => {
    res.render('index', {
        title: 'API Documentation for Media endpoints',
        message: mediaDocs,
        exampleData: mediaItems,
    });
});

/**
 * Route to render API documentation for user endpoints.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get('/api/app/users', (req, res) => {
    res.render('index', {
        title: 'API Documentation for User endpoints',
        message: userDocs,
        exampleData: userItems,
    });
});

// Media resource endpoints

/**
 * Route to get all media items.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get('/api/media', (req, res) => {
    getItems(res);
});

/**
 * Route to get a media item by ID.
 * @function
 * @param {Object} req - The request object containing the media ID in the URL.
 * @param {Object} res - The response object.
 */
app.get('/api/media/:id', (req, res) => {
    getItemById(req, res);
});

/**
 * Route to create a new media item.
 * @function
 * @param {Object} req - The request object containing the new media data in the body.
 * @param {Object} res - The response object.
 */
app.post('/api/media', (req, res) => {
    postItem(req, res);
});

/**
 * Route to update an existing media item by ID.
 * @function
 * @param {Object} req - The request object containing the media ID in the URL and updated data in the body.
 * @param {Object} res - The response object.
 */
app.put('/api/media/:id', (req, res) => {
    modifyItem(req, res);
});

// User resource endpoints

/**
 * Route to get all users.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get('/api/users', (req, res) => {
    getUserItems(req, res);
});

/**
 * Route to get a user by ID.
 * @function
 * @param {Object} req - The request object containing the user ID in the URL.
 * @param {Object} res - The response object.
 */
app.get('/api/users/:id', (req, res) => {
    getUserItemById(req, res);
});

/**
 * Route to create a new user.
 * @function
 * @param {Object} req - The request object containing the new user data in the body.
 * @param {Object} res - The response object.
 */
app.post('/api/users', (req, res) => {
    postUserItem(req, res);
});

/**
 * Route to update an existing user by ID.
 * @function
 * @param {Object} req - The request object containing the user ID in the URL and updated data in the body.
 * @param {Object} res - The response object.
 */
app.put('/api/users/:id', (req, res) => {
    modifyUserItem(req, res);
});

/**
 * Route to delete a user by ID.
 * @function
 * @param {Object} req - The request object containing the user ID in the URL.
 * @param {Object} res - The response object.
 */
app.delete('/api/users/:id', (req, res) => {
    deleteUserItem(req, res);
});

// Start the server
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
