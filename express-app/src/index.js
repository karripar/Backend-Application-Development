import express from 'express';
import cors from 'cors';
//import { getUserItemById, getUserItems, postUserItem, modifyUserItem, deleteUserItem } from './users.js';
import { mediaDocs, userDocs, ratingDocs } from './docs.js';
import mediaRouter from './routes/mediaRouter.js';
import userRouter from './routes/userRouter.js';
import ratingRouter from './routes/ratingRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth-router.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';



const hostname = '127.0.0.1';
const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.set('view engine', 'pug');
app.set('views', 'src/views');



// Serve static files (HTML, CSS, JS) from the public directory
app.use(express.static('public'));

// Serve uploaded media files
app.use('/uploads', express.static('uploads'));

// Serve user-related media files
app.use('/media', express.static('media'));


app.use('/apidoc', express.static('doc')); // Specifically for 'apidoc' directory

app.get('/apidoc', (req, res) => {
    res.sendFile(path.join(__dirname, 'doc', 'index'));
});

// Serve documentation for the API
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use('/docs', express.static('docs')); // Specifically for 'docs' directory

app.get('/readme', (req, res) => {
    res.sendFile(path.join(__dirname, '..','readme.md'));
});

app.use(express.static(__dirname));



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

app.use('/api/auth', authRouter);

// default route, if no other route is matched
app.use(notFoundHandler);
// error handler middleware
app.use(errorHandler);

// Start the server
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});