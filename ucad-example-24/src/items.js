import { formatTimestamp } from "./utils.js";

// items.js
const items = [{ // initial items
    "id": 1,
    "name": "item1",
    "timestamp": formatTimestamp()
}, {
    "id": 2,
    "name": "item2",
    "timestamp": formatTimestamp()
}];


/*const getItems = (res) => { // get all items
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(items)); };*/

const postItem = (req, res) => {
    let body = [];
    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log('body: ', body);
        const item = JSON.parse(body);
        
        const id = items.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1; // item id is the highest id + 1
        item.id = id;
        item.timestamp = formatTimestamp();
        items.push(item);

        // at this point, `body` has the entire request body stored in it as a string
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Item added'}));
  });
 };

const updateItem = (req, res) => { // update an item (name)
    let body = [];
    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        try {
            const updatedItem = JSON.parse(body);
            const index = items.findIndex(item => item.id === updatedItem.id); // find the index of the item to update
            if (index != -1) {
                items[index].name = updatedItem.name || items[index].name; // update the name if provided
                items[index].timestamp = formatTimestamp();
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Item updated'}));
            } else {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: '404', message: 'Item not found'}));
            }
        } catch (error) {
            console.log('error: ', error);
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: '400', message: ' Invalid request'}));
        }
    });
};

const deleteItem = (req, res) => { // delete an item
    let body = [];
    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        try {
            const deletedItem = JSON.parse(body);
            const index = items.findIndex(item => item.id === deletedItem.id); // find the index of the item to delete
            if (index != -1) { // if the item exists
                items.splice(index, 1); // delete the item
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Item deleted'}));
            } else {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: '404', message: 'Item not found'}));
            }
        } catch (error) {
            console.log('error: ', error);
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: '400', message: ' Invalid request'}));
        }
    });
}


const getItems = (req, res) => { // search for items by name or get all items
    let body = [];
    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        try {
            const url = req.url.split('?'); // split the url into the path and the query string
            let filteredItems = items;

            if (url.length > 1) {
                const query = new URLSearchParams(url[1]); // get the query string
                const search = query.get('search');

                if (search) {
                    filteredItems = items.filter(item => item.name.toLowerCase().includes(search.toLowerCase())); // filter items by name
                }

                if (filteredItems.length === 0) {
                    res.writeHead(404, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: '404', message: 'No item found'}));
                    return;
                }
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(filteredItems));
        } catch (error) {
            console.log('error: ', error);
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: '400', message: ' Invalid request, no item found'}));
        }
    })   
}



export {getItems, postItem, updateItem, deleteItem};