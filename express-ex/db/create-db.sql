DROP DATABASE IF EXISTS mediashare;
CREATE DATABASE mediashare;
USE mediashare;

CREATE TABLE Users (
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_level_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE MediaItems (
  media_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  filesize INT NOT NULL,
  media_type VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP NOT NULL,
  PRIMARY KEY (media_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Ratings (
  rating_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  media_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  UNIQUE (user_id, media_id)
);

CREATE TABLE Favorites (
  favorite_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  media_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id),
  UNIQUE (user_id, media_id) 
);


INSERT INTO Users VALUES (260, 'VCHar', 'secret123', 'vchar@example.com', 1, null);
INSERT INTO Users VALUES (305, 'Donatello', 'secret234', 'dona@example.com', 1, null);

-- Inserting multiple records at once
INSERT INTO MediaItems (filename, filesize, title, description, user_id, media_type, created_at) 
  VALUES ('ffd8.jpg', 887574, 'Favorite drink', null, 305, 'image/jpeg', null),
         ('dbbd.jpg', 60703, 'Miika', 'My Photo', 305, 'image/jpeg', NULL),
         ('2f9b.jpg', 30635, 'Aksux and Jane', 'friends', 260, 'image/jpeg', null);

INSERT INTO Ratings (media_id, user_id, rating, created_at) 
VALUES 
  (1, 305, 5, null),
  (2, 305, 3, null),
  (3, 260, 4, null);

INSERT INTO Favorites (user_id, media_id, created_at) 
VALUES 
  (305, 1, null),
  (305, 2, null),
  (260, 3, null);


-- QUERIES
-- 1. Get all media items user has rated (username, title, )
SELECT * FROM MediaItems WHERE media_id IN (SELECT media_id FROM Ratings WHERE user_id = 305);

-- 2. top rated media items
SELECT MediaItems.title, AVG(Ratings.rating) AS average_rating
FROM Ratings
JOIN MediaItems ON Ratings.media_id = MediaItems.media_id
GROUP BY MediaItems.media_id, MediaItems.title
ORDER BY average_rating DESC
LIMIT 5;

-- 3. show user count
SELECT COUNT(*) AS total_users FROM Users;


-- 4. search users by name
SELECT * FROM Users WHERE username = 'VCHar';

-- 5. show latest media items
SELECT * FROM MediaItems ORDER BY created_at DESC LIMIT 5;

-- UPDATE ratings
UPDATE Ratings 
SET rating = 4 
WHERE user_id = 305 AND media_id = 1;

-- 4. DELETE from ratings and favorites
DELETE FROM Ratings 
WHERE user_id = 305 AND media_id = 2;

DELETE FROM Favorites 
WHERE user_id = 260 AND media_id = 3;