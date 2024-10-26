Simple REST API example -->

----------------**Used endpoints:**-------------------------

"**GET /items** fetches all items"
-fetches all items from the REST API endpoint or searches for specific items.
-returns a list of items
*Fetch all items* -->
GET /items

*Search for items* -->
GET /items?search=yourSearchTermHere

*Expected example Response* -->
{
    "id": 1,
    "name": "yourSearchTerm",
    "timestamp": ""2024-10-24T12"
}


--------------------------------------------------------------

"**POST /items** Adds a new item"
-example Request body format: {"name": "Banana"}
-Assigns an id automatically based on the pre-existing items
-Creates a timestamp automatically in ISO format

-Example Response:
{
    "message": "Item",
    "item": {
        "id": 3,
        "name": "Banana",
        "timestamp": "2024-10-24T12"
    }
}

-------------------------------------------------------------

"**PUT /items**: modifies pre-existing items"
-Changes the item name
-Example Request body format: {"id": x, "name": "Banana"}
-Expected response: {"message": "Item updated"}

-------------------------------------------------------------

"**DELETE /items**: Deletes a specified item"
-Deletes an item based on the id provided by the user
-Example Request body format: {"id": "3"}


------------------**Unexpected errors**----------------------

"**400 Bad Request**": Provided JSON format is invalid
-Fix it, and next time read the documentation carefully.

"**404 Not Found**": The item was not found or the route is invalid
-Check the provided JSON format and possible endpoint typos

--------------------------------------------------------------

Copyright:
**Karri Partanen**
**karripar**
10/2024
