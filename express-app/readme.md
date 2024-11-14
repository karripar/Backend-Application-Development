# Mock Data API

This project provides a RESTful API with endpoints for managing user data and media resources. It serves mock data for testing and development purposes.

## Documentation

You can access the API documentation rendered with Pug templates at the following URLs when the server is running. 

- [Media API Documentation](http://localhost:3000/api/app/media): Detailed documentation for the media endpoints.
- [User API Documentation](http://localhost:3000/api/app/users): Detailed documentation for the user endpoints.

## Usage Instructions

To interact with the API:

### MySQL-Connection
1. Clone
2. Run `npm install`
3. Create database
4. Create an .env-file, see (`.env.sample`)

1. **Run the Server**:
   Start the server by executing:
   `npm run dev`

2. Open the server location: 127.0.0.1:3000 or the documentation locations explained above for more detail.

---

## API Endpoints

### Media Endpoints

- **GET** `/api/media`
  - Retrieves a list of all media items.
  

- **GET** `/api/media/:id`
  - Retrieves a single media item by its unique ID.


- **POST** `/api/media`
  - Adds a new media item. 
  - **Request Body**: JSON payload with media details.
  - ie.
  ```json
  {
    "filename": "uusi.jpg",
    "filesize": 887574,
    "title": "Uusi kuva",
    "description": "testikuvaus",
    "user_id": 1606,
    "media_type": "image/jpeg"
  }


- **PUT** `/api/media/:id`
  - Updates an existing media item by ID.
  - **Request Body**: JSON payload with updated media details.
  ```json
  {
  "title": "new picture",
  "description": "new information about the cat",
  "user_id": 3,
  "filename": "cat.png",
  "filesize": 123456,
  "media_type": "image/png"
  }


---

### User Endpoints

- **GET** `/api/users`
  - Retrieves a list of all users.


- **GET** `/api/users/:id`
  - Retrieves a single user by their ID.
  - ie. `/api/users/3`


- **POST** `/api/users`
  - Adds a new user.
  - **Request Body**: JSON payload with user information.
  ```json
  {
  "username": "newuser3",
  "email": "newuser3@example.com",
  "password": "password1232",
  "user_level_id": 1
  }


- **PUT** `/api/users/:id`
  - Updates user information based on user ID.
  - **Request Body**: JSON payload with updated user details.
  ```json
  {
  "username": "name",
  "email": "name@example.com",
  "password": "password",
  "user_level_id": "2"
  }


- **DELETE** `/api/users/:id`
  - Deletes a user based on their ID.
  -ie. `/api/users/305`

---

### Rating Endpoints

- **GET** `/api/ratings`  
  - Retrieves a list of all ratings.


- **GET** `/api/ratings/media/:id`  
  - Retrieves all ratings associated with a specific media item by its ID.


- **GET** `/api/ratings/user/:id`  
  - Retrieves all ratings submitted by a specific user by their ID.


- **POST** `/api/ratings`  
  - Adds a new rating.
  - **Request Body**: JSON payload with rating details.
  ```json
  {
    "rating_value": 4,
    "media_id": 1,
    "user_id": 2
  }


- **DELETE** `/api/ratings/:id`  
  - Deletes a rating by its unique ID.
  - **Example Request**: `/api/ratings/10`
  - **Response**: 
    - `200 OK`: Rating deleted successfully.
    - `404 Not Found`: Rating with specified ID does not exist.


- **PUT** `/api/ratings/:id`  
  - Updates an existing rating by its unique ID.
  - **Request Body**: JSON payload with the updated rating value (between 1 and 5).
  - **Example Request**:
    ```json
    {
      "rating_value": 4
    }
    ```
  - **Response**: 
    - `200 OK`: Rating updated successfully.
    - `400 Bad Request`: Invalid rating value or missing fields.
    - `404 Not Found`: Rating with specified ID does not exist.


