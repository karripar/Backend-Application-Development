# Database REST API

This project provides a RESTful API with endpoints for managing user data, media and ratings resources. Data is served from a mysql database. 

## Documentation

You can access the API documentation at the following URLs when the server is running. 

- [ApiDoc API Documentation](http://localhost:3000/apidoc): Extensive API documentation.

## Important to know
 - Each API-Endpoint is limited to 30 requests by a client within a 15 minute window.
 - Limiting the number of requests was implemented with `express-rate-limit`.

## Usage Instructions

To interact with the API:

### MySQL-Connection
1. Clone the repository
2. Run `npm install` in your preferred terminal.
3. Create the database with the source file: `media-db.sql` in the db directory.
4. Create an .env-file, see (`.env.sample`)

1. **Run the Server**:
   Start the server by executing:
   `npm run dev`

2. Open the server location: `127.0.0.1:3000` or the documentation locations explained above for more detail.

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
  - Retrieves all ratings associated with a specific media item.
  - ie `/api/ratings/media/2`


- **GET** `/api/ratings/user/:id`  
  - Retrieves all ratings submitted by a specific user.
  -ie `/api/ratings/user/3`


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

---

### Authorization Endpoints

- **POST** `/api/login`
  - Authenticates a user and generates a JWT token.
  - **Request Body**:
    JSON payload with `username` and `password`.
    ```json
    {
      "username": "user123",
      "password": "password123"
    }
    ```
    - **Response**:
      - `200 OK`: Login successful, JWT token returned.
      - `400 Bad Request`: Invalid request body (e.g., missing fields).
      - `401 Unauthorized`: Invalid username or password.

- **POST** `/api/register`
  - Registers a new user with `username`, `email`, and `password`.
  - **Request Body**:
    JSON payload with `username`, `email`, and `password`.
    ```json
    {
      "username": "newuser",
      "email": "newuser@example.com",
      "password": "password123"
    }
    ```
    - **Response**
     - `201 Created`: User registered successfully.
     - `400 Bad Request`: Invalid input or missing fields.
     - `409 Conflict`: Username or email already exists.

- **GET** `/api/me`
  - Retrieves the currently authenticated user’s information.
  - **Authorization**: JWT token must be included in the `Authorization` header as `Bearer <token>`.
  - **Response**:
    - `200 OK`: User details returned.
    - `401 Unauthorized`: Missing or invalid JWT token.
  - **Example Response**:
    ```json
    {
      "id": 1,
      "username": "user123",
      "email": "user123@example.com"
    }
    ```

# Authorization Rules for Protected Routes

In this application, certain API routes are protected to ensure that only authorized users can perform specific actions. These rules are implemented using middleware that validates the user's identity and role based on their JSON Web Token (JWT) and checks against the database where necessary.

## Rules and Descriptions

### **1. `PUT /api/media/:id` - Update Media Item**
- **Authorization Rule**: Only the owner of the media item can update it.
- **Implementation**: 
  - The request's `user_id` (extracted from the JWT) is compared to the `user_id` associated with the media item in the database.
  - If the IDs do not match, the request is rejected with a `403 Forbidden` response.
- **Example Response**:
  - **Success**: 
    ```json
    { "success": true, "message": "Media item updated successfully." }
    ```
  - **Failure**: 
    ```json
    { "success": false, "error": "You are not authorized to update this media item." }
    ```

---

### **2. `DELETE /api/media/:id` - Delete Media Item**
- **Authorization Rule**: Only the owner of the media item can delete it.
- **Implementation**:
  - The request's `user_id` (extracted from the JWT) is compared to the `user_id` associated with the media item in the database.
  - Admins (`user_level_id === 2`) are allowed to delete any media item.
- **Example Response**:
  - **Success**: 
    ```json
    { "success": true, "message": "Media item deleted successfully." }
    ```
  - **Failure**: 
    ```json
    { "success": false, "error": "You are not authorized to delete this media item." }
    ```

---

### **3. `PUT /api/users/` - Update User Info**
- **Authorization Rule**: Users can update only their own information.
- **Implementation**:
  - The `user_id` from the JWT must match the `user_id` in the request body.
  - Admins are allowed to update user information for all users.
- **Example Response**:
  - **Success**: 
    ```json
    { "success": true, "message": "User information updated successfully." }
    ```
  - **Failure**: 
    ```json
    { "success": false, "error": "You are not authorized to update this user information." }
    ```

---

## Implementation Details
- **Middleware**: Authorization logic is implemented as middleware that runs before the route handler.
- **JWT Authentication**:
  - JWTs are validated to ensure the user is authenticated.
  - The token's payload contains the `user_id` and `user_level_id` to enforce the rules.
- **Database Checks**:
  - User and media ownership are verified by querying the database for matching `user_id` values.

## Error Responses
- Unauthorized actions return a `403 Forbidden` status with a descriptive error message.
- Invalid or expired tokens return a `401 Unauthorized` status.

## Notes
- These rules ensure that data integrity and user privacy are maintained across the application.
- Admin-level users (`user_level_id === 2`) are granted extended permissions as specified.

---

# Validation and Sanitization Rules

In this application, server-side validation and sanitization are implemented for all input data using the `express-validator` library. These measures ensure that data integrity is maintained and that malicious or invalid data is rejected before reaching the application logic. Following rules and logic are applied to all routes to also ensure robust error handling and client side experience.

## Validation Rules

### **1. User Routes (`/api/users`)**

#### **POST /api/users/** - Create a New User
- **Validation Rules**:
  - `username`: 
    - Must be alphanumeric (`isAlphanumeric()`).
    - Length must be between 3 and 20 characters (`isLength({ min: 3, max: 20 })`).
    - Leading and trailing spaces are trimmed (`trim()`).
  - `password`:
    - Minimum length of 8 characters (`isLength({ min: 8 })`).
  - `email`:
    - Must be a valid email format (`isEmail()`).
- **Sanitization**:
  - Input fields are trimmed to remove excess whitespace.
- **Example Validation Error**:
  ```json
  { "error": "Validation error: username, email" }


### **PUT /api/users/** - Update User Info

#### **Validation Rules**:
- **`username`**: 
  - Must be alphanumeric (`isAlphanumeric()`).
  - Length must be between 3 and 20 characters (`isLength({ min: 3, max: 20 })`).
  - Leading and trailing whitespace is trimmed (`trim()`).
- **`password`**: 
  - Minimum length of 8 characters (`isLength({ min: 8 })`).
- **`email`**: 
  - Must be a valid email format (`isEmail()`).

#### **Sanitization**:
- All input fields are trimmed to remove excess whitespace.
- Strings are escaped to prevent malicious code injection (`escape()`).

#### **Error Handling**:
- If validation fails, a `400 Bad Request` response is returned with details of the invalid fields.
- Example Error Response:
  ```json
  { "error": "Validation error: username, email" }

---

### **2. Media Routes (`/api/media`)**

### **PUT /api/media/:id** - Update Media Item

#### **Validation Rules**:
- **`title`**:
  - Must not be empty (`notEmpty()`).
  - Length must be between 3 and 50 characters (`isLength({ min: 3, max: 50 })`).
  - Leading and trailing whitespace is trimmed (`trim()`).
- **`description`**:
  - Maximum length of 255 characters (`isLength({ max: 255 })`).
  - Leading and trailing whitespace is trimmed (`trim()`).

#### **Sanitization**:
- All input fields are trimmed to remove excess whitespace.
- Strings are escaped to prevent malicious code injection (`escape()`).

#### **Error Handling**:
- If validation fails, a `400 Bad Request` response is returned with details of the invalid fields.
- Example Error Response:
  ```json
  { "error": "Validation error: title, description" }


### **POST /api/media** - Create Media Item

#### **Validation Rules**:
- **`title`**:
  - The title must be between 3 and 50 characters in length (`isLength({ min: 3, max: 50 })`).
  - Leading and trailing whitespace is trimmed (`trim()`).
- **`description`**:
  - The description must be a maximum of 255 characters (`isLength({ max: 255 })`).
  - Leading and trailing whitespace is trimmed (`trim()`).
- **File**:
  - The file is uploaded using `upload.single('file')`. The file type and size are validated within the `upload` middleware (e.g., only image files and under a certain size limit).

#### **Sanitization**:
- All input fields are trimmed to remove excess whitespace.
- Strings are sanitized by escaping potentially dangerous characters (`escape()`).

#### **Error Handling**:
- If validation fails, a `400 Bad Request` response is returned with the error details.
- Example Error Response:
  ```json
  { "error": "Validation error: title, description" }


### **DELETE /api/media/:id** - Delete Media Item

#### **Validation Rules**:
- **`id`**:
  - The `id` parameter in the URL must be a valid integer (`isInt()`).
  - It must be a positive number (`isInt({ min: 1 })`).

#### **Sanitization**:
- No specific sanitization is applied to the `id` parameter because it is a number and sanitized using `isInt()`.

#### **Error Handling**:
- If validation fails, a `400 Bad Request` response is returned with the error details.
- Example Error Response:
  ```json
  { "error": "Validation error: id" }

---

### **3. User Routes (`/api/ratings`)**

### **POST** `/api/ratings` - Create Rating

#### **Validation Rules**:
- **`rating_value`**:
  - The rating must be an integer between 1 and 5 (`isInt({ min: 1, max: 5 })`).

#### **Sanitization**:
- The rating value is sanitized by escaping potentially dangerous characters.

#### **Error Handling**:
- If validation fails, a `400 Bad Request` response is returned with the error details.
- Example Error Response:
  ```json
  { "error": "Validation error: rating_value" }


### **PUT** `/api/ratings/:id` - Update Rating

#### **Validation Rules**:
- **`rating_value`**:
  - The rating must be an integer between 1 and 5 (`isInt({ min: 1, max: 5 })`).

#### **Sanitization**:
- The rating value is sanitized by escaping potentially dangerous characters.

#### **Error Handling**:
- If validation fails, a `400 Bad Request` response is returned with the error details.
- If the rating with the specified ID does not exist, a `404 Not Found` response is returned.
- Example Error Response:
  ```json
  { "error": "Validation error: rating_value" }

---

### **4. Authorization routes (`/api/`)**

### **POST** `/api/login` - User Login

#### **Validation Rules**:
- **`username`**:
  - The username must be alphanumeric and between 3 and 20 characters in length (`isAlphanumeric()`, `isLength({ min: 3, max: 20 })`).
- **`password`**:
  - The password must be at least 8 characters in length (`isLength({ min: 8 })`).

#### **Error Handling**:
- If validation fails, a `400 Bad Request` response is returned with the error details.
- If the login is successful, a `200 OK` response is returned with the authentication token.
- Example Error Response (Validation error):
  ```json
  { "error": "Validation error: username, password" }


### **POST** `/api/register` - User Registration

#### **Validation Rules**:
- **`username`**:
  - The username must be alphanumeric and between 3 and 20 characters in length (`isAlphanumeric()`, `isLength({ min: 3, max: 20 })`).
- **`password`**:
  - The password must be at least 8 characters in length (`isLength({ min: 8 })`).
- **`email`**:
  - The email must be a valid email format (`isEmail()`).

#### **Sanitization**:
- **`username`**:
  - Leading and trailing whitespace is trimmed (`trim()`).

#### **Error Handling**:
- If validation fails, a `400 Bad Request` response is returned with the error details.
- If the registration is successful, a `201 Created` response is returned with the user details.
- Example Error Response (Validation error):
  ```json
  { "error": "Validation error: username, password, email" }

