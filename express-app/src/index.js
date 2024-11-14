import express from 'express';
//import { getUserItemById, getUserItems, postUserItem, modifyUserItem, deleteUserItem } from './users.js';
import { mediaDocs, userDocs, ratingDocs } from './docs.js';
import mediaRouter from './routes/mediaRouter.js';
import userRouter from './routes/userRouter.js';
import ratingRouter from './routes/ratingRouter.js';


const hostname = '127.0.0.1';
const port = 3000;
const app = express();

app.set('view engine', 'pug');
app.set('views', 'src/views');

app.use(express.json());

// Serve static files (HTML, CSS, JS) from the public directory
app.use(express.static('public'));

// Serve uploaded media files
app.use('/uploads', express.static('uploads'));

// Serve user-related media files
app.use('/media', express.static('media'));

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
    });
});

/**
 * Route to render API documentation for rating endpoints.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get('/api/app/ratings', (req, res) => {
    res.render('index', {
        title: 'API Documentation for Rating endpoints',
        message: ratingDocs,
    });
});



app.use('/api/media', mediaRouter);

app.use('/api/users', userRouter);

app.use('/api/ratings', ratingRouter);

// Start the server
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
