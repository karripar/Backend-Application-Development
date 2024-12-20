'use strict';

const mediaDocs = `
    <b>The Media API</b> provides endpoints to manage media resources, including images, videos, and other files.<br><br>

    - <b>GET <code>/api/media</code></b>: Retrieve a list of all media items. Check the item details there!<br><br>
    - <b>GET <code>/api/media/:id</code></b>: Retrieve a single media item by its unique ID.<br><br>
    - <b>POST <code>/api/media</code></b>: Add a new media item. Requires a JSON payload with relevant media details.<br><br>
    - <b>PUT <code>/api/media/:id</code></b>: Update an existing media item. Requires the media item's ID and updated data in JSON format.<br><br>
    - <b>Static Access</b>: All uploaded media files can be accessed directly via <code>/media</code> (e.g., <code>/media/kissa.png</code>).<br><br><br><br>
    See also the <a href="/api/app/users">User API</a> for user-related endpoints.
    Or check out the <a href="/api/app/ratings">Ratings API</a> for rating-related endpoints.
`;

const userDocs = `
    <b>The User API</b> manages user resources, supporting operations for user data creation, retrieval, updating, and deletion.<br><br>

    - <b>GET <code>/api/users</code></b>: Retrieve a list of all users. Check the item details there!<br><br>
    - <b>GET <code>/api/users/:id</code></b>: Retrieve a single user by ID.<br><br>
    - <b>POST <code>/api/users</code></b>: Add a new user. Requires a JSON payload with user information.<br><br>
    - <b>PUT <code>/api/users/:id</code></b>: Update user information based on user ID. Expects JSON data with updated user details.<br><br>
    - <b>DELETE <code>/api/users/:id</code></b>: Delete a user by their ID.<br><br>
    - <b>Static Access</b>: All uploaded media files can be accessed directly via <code>/users</code> (e.g., <code>/users/jeremy.png</code>).<br><br><br><br>
    See also the <a href="/api/app/ratings">Ratings API</a> for rating-related endpoints.
    Or check out the <a href="/api/app/media">Media API</a> for media-related endpoints.
`;

const ratingDocs = `
    <b>The Ratings API</b> allows users to rate media items with a value between 1 and 5, providing endpoints for creation, retrieval, updating, and deletion of ratings.<br><br>

    - <b>GET <code>/api/ratings</code></b>: Retrieve a list of all ratings.<br><br>
    - <b>GET <code>/api/ratings/:id</code></b>: Retrieve a single rating by its unique ID.<br><br>
    - <b>GET <code>/api/ratings/media/:id</code></b>: Retrieve all ratings for a specific media item by its ID.<br><br>
    - <b>GET <code>/api/ratings/user/:id</code></b>: Retrieve all ratings by a specific user by their ID.<br><br>
    - <b>POST <code>/api/ratings</code></b>: Add a new rating. Requires a JSON payload with <code>rating_value</code> (between 1 and 5), <code>media_id</code>, and <code>user_id</code>.<br><br>
    - <b>PUT <code>/api/ratings/:id</code></b>: Update an existing rating by ID. Requires JSON payload with updated <code>rating_value</code> (between 1 and 5).<br><br>
    - <b>DELETE <code>/api/ratings/:id</code></b>: Delete a rating by its ID.<br><br><br><br>
    See also the <a href="/api/app/media">Media API</a> for media-related endpoints.
    Or check out the <a href="/api/app/users">User API</a> for user-related endpoints.
`;

export { mediaDocs, userDocs, ratingDocs };
