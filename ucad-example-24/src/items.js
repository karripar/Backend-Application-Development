import { formatTimestamp } from "./utils.js";

const items = [{
    "id": 1,
    "name": "item1",
    "timestamp": formatTimestamp()
}, {
    "id": 2,
    "name": "item2",
    "timestamp": formatTimestamp()
}];


const getItems = (res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(items)); };

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

const updateItem = (req, res) => {
    let body = [];
    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        try {
            const updatedItem = JSON.parse(body);
            const index = items.findIndex(item => item.id === updatedItem.id);
            if (index != -1) {
                items[index].name = updatedItem.name || items[index].name;
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

const deleteItem = (req, res) => {
    let body = [];
    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        try {
            const deletedItem = JSON.parse(body);
            const index = items.findIndex(item => item.id === deletedItem.id);
            if (index != -1) {
                items.splice(index, 1);
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



export {getItems, postItem, updateItem, deleteItem};