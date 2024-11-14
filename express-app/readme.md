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
2. Run "npm install"
3. Create database
4. Create an .env-file, see (`.env.sample`)

1. **Run the Server**:
   Start the server by executing:
   npm run dev

2. Open the server location: 127.0.0.1:3000 or the documentation locations explained above for more detail.


## API Endpoints

### Media Endpoints

- **GET /api/media**
  - Retrieves a list of all media items.
  
- **GET /api/media/:id**
  - Retrieves a single media item by its unique ID.

- **POST /api/media**
  - Adds a new media item. 
  - **Request Body**: JSON payload with media details.
  - ie.
  {
    "filename": "uusi.jpg",
    "filesize": 887574,
    "title": "Uusi kuva",
    "description": "testikuvaus",
    "user_id": 1606,
    "media_type": "image/jpeg",
    "created_at": "2023-10-16T19:00:09.000Z"
  }

- **PUT /api/media/:id**
  - Updates an existing media item by ID.
  - **Request Body**: JSON payload with updated media details.

### User Endpoints

- **GET /api/users**
  - Retrieves a list of all users.

- **GET /api/users/:id**
  - Retrieves a single user by their ID.

- **POST /api/users**
  - Adds a new user.
  - **Request Body**: JSON payload with user information.

- **PUT /api/users/:id**
  - Updates user information based on user ID.
  - **Request Body**: JSON payload with updated user details.

- **DELETE /api/users/:id**
  - Deletes a user based on their ID.
  -ie. /api/users/305


