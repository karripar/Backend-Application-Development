import express from 'express';
import {getItemById, getItems, postItem, mediaItems, modifyItem} from './media.js';
import { userItems, getUserItemById, getUserItems, postUserItem, modifyUserItem, deleteUserItem} from './users.js';
import { mediaDocs, userDocs } from './docs.js';
const hostname = '127.0.0.1';
const port = 3000;
const app = express();

app.set('view engine', 'pug');
app.set('views', 'src/views')

app.use(express.json());

// home page (client) as static html, css, js
app.use(express.static('public'));
// Uploaded media files
app.use('/media', express.static('media'));
app.use('/users', express.static('media'));

// API documentation with pug
app.get('/api/app/media', (req, res) => {
    res.render('index', {
        title: 'API Documentation for Media endpoints', 
        message: mediaDocs,
        exampleData: mediaItems,
    });
});

app.get('/api/app/users', (req, res) => {
    res.render('index', {
        title: 'API Documentation for User endpoints', 
        message: userDocs,
        exampleData: userItems,
    });
});


// Media resource endpoints
app.get('/api/media', (req, res) => {
  getItems(res);
});

app.get('/api/media/:id', (req, res) => {
  getItemById(req, res);
});
app.post('/api/media', (req, res) => {
  postItem(req, res);
});
app.put('/api/media/:id', (req, res) => {
  modifyItem(req, res);
});


// User resource endpoints
app.get('/api/users', (req, res) => {
  getUserItems(req, res);
});

app.get('/api/users/:id', (req, res) => {
  getUserItemById(req, res);
});

app.post('/api/users', (req, res) => {
  postUserItem(req, res);
});

app.put('/api/users/:id', (req, res) => {
  modifyUserItem(req, res);
});

app.delete('/api/users/:id', (req, res) => {
  deleteUserItem(req, res);
});


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});