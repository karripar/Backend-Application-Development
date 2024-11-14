'use strict';

const mediaDocs = `
    <b>The Media API</b> provides endpoints to manage media resources, including images, videos, and other files.<br><br>

    - <b>GET <code>/api/media</code></b>: Retrieve a list of all media items. Check the item details there!<br><br>
    - <b>GET <code>/api/media/:id</code></b>: Retrieve a single media item by its unique ID.<br><br>
    - <b>POST <code>/api/media</code></b>: Add a new media item. Requires a JSON payload with relevant media details.<br><br>
    - <b>PUT <code>/api/media/:id</code></b>: Update an existing media item. Requires the media item's ID and updated data in JSON format.<br><br>
    - <b>Static Access</b>: All uploaded media files can be accessed directly via <code>/media</code> (e.g., <code>/media/kissa.png</code>).<br><br>
`;

const userDocs = `
    <b>The User API</b> manages user resources, supporting operations for user data creation, retrieval, updating, and deletion.<br><br>

    - <b>GET <code>/api/users</code></b>: Retrieve a list of all users. Check the item details there!<br><br>
    - <b>GET <code>/api/users/:id</code></b>: Retrieve a single user by ID.<br><br>
    - <b>POST <code>/api/users</code></b>: Add a new user. Requires a JSON payload with user information.<br><br>
    - <b>PUT <code>/api/users/:id</code></b>: Update user information based on user ID. Expects JSON data with updated user details.<br><br>
    - <b>DELETE <code>/api/users/:id</code></b>: Delete a user by their ID.<br><br>
    - <b>Static Access</b>: All uploaded media files can be accessed directly via <code>/users</code> (e.g., <code>/users/jeremy.png</code>).<br><br>

`;

export {mediaDocs, userDocs};