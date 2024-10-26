// index.js
import http from 'http';
import {getItems, postItem, updateItem, deleteItem} from './items.js';
const hostname = '127.0.0.1'; 
const port = 3000;


const server = http.createServer((req, res) => {
    const {url, method} = req;
    console.log('url: ',url, 'method: ',method);

    if (url.startsWith('/items') && method === 'GET') { // get all items or search for items
        getItems(req, res);

    } else if (url === '/items' && method === 'POST') { // add an item
        postItem(req, res);

    } else if (url === '/items' && method === 'PUT') { // update an item
        updateItem(req, res);

    } else if (url === '/items' && method === 'DELETE') { // delete an item
        deleteItem(req, res);

    } else { 
        // generic not found response
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: '404', message: 'Route not found'}));
    }
});

// start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
