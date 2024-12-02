DROP DATABASE IF EXISTS Tataki;
CREATE DATABASE Tataki;
USE Tataki;

-- source C:/Users/karri/OneDrive/Documents/Sovelluskehitys-S24/express-app/db/tataki-db.sql; 
--only for Karri because of the annoying backslashes in the path

-- Create the tables
CREATE TABLE UserLevels (
    level_id TINYINT AUTO_INCREMENT PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL
);

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(15) NOT NULL UNIQUE,
    password_hash VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    user_level_id TINYINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_level_id) REFERENCES UserLevels(level_id)
);

CREATE TABLE Menus (
    menu_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(50) NOT NULL,
    course_description TEXT NOT NULL,
    price DECIMAL(5,2) NOT NULL,
    category VARCHAR(20) NOT NULL
);

CREATE TABLE FoodReview (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    review TEXT NOT NULL,
    star_rating TINYINT NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
    menu_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (menu_id) REFERENCES Menus(menu_id)
);

CREATE TABLE RestReview (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    review TEXT NOT NULL,
    star_rating TINYINT NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_type ENUM('delivery', 'pickup') NOT NULL,
    order_status ENUM('pending', 'in progress', 'delivered') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guests TINYINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Allergens (
    allergen_id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT NOT NULL,
    allergen_description TEXT NOT NULL,
    FOREIGN KEY (menu_id) REFERENCES Menus(menu_id)
);

CREATE TABLE OrderItems (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_id INT NOT NULL,
    quantity INT NOT NULL,
    total_cost DECIMAL(5,2) NOT NULL,
    comments TEXT,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (menu_id) REFERENCES Menus(menu_id)
);


-- Insert more mock data into UserLevels
INSERT INTO UserLevels (level_name) VALUES 
    ('Regular User'),
    ('Admin');

-- Insert more mock data into Users
INSERT INTO Users (username, password_hash, email, phone_number, user_level_id) VALUES 
    ('sushiFan', 'hashed_password_1', 'sushiFan@example.com', '555-1234', 1),
    ('tempuraBoss', 'hashed_password_2', 'tempuraBoss@example.com', '555-5678', 2),
    ('ramenLover', 'hashed_password_3', 'ramenLover@example.com', '555-8765', 1),
    ('bentoKing', 'hashed_password_4', 'bentoKing@example.com', '555-4321', 1),
    ('sakeQueen', 'hashed_password_5', 'sakeQueen@example.com', '555-3456', 1);

-- Insert more mock data into Menus
INSERT INTO Menus (course_name, course_description, price, category) VALUES 
    ('Sushi Platter', 'A selection of fresh sushi and sashimi', 25.99, 'Sushi'),
    ('Tempura Udon', 'Udon noodles with crispy tempura', 12.50, 'Noodles'),
    ('Chicken Teriyaki', 'Grilled chicken with teriyaki sauce', 14.75, 'Entree'),
    ('Miso Soup', 'Traditional Japanese miso soup', 3.50, 'Appetizer'),
    ('Salmon Nigiri', 'Fresh salmon nigiri sushi', 5.99, 'Sushi'),
    ('Vegetable Ramen', 'Noodles with fresh veggies in miso broth', 9.50, 'Noodles'),
    ('Beef Bento', 'Beef teriyaki, rice, salad, and miso soup', 16.25, 'Bento Box'),
    ('Matcha Ice Cream', 'Japanese green tea ice cream', 4.50, 'Dessert');

-- Insert more mock data into FoodReview
INSERT INTO FoodReview (user_id, review, star_rating, menu_id) VALUES 
    (1, 'Absolutely delicious sushi!', 5, 1),
    (2, 'Perfect tempura and noodles!', 5, 2),
    (3, 'Great flavor but a bit salty.', 4, 2),
    (4, 'Loved the teriyaki sauce!', 5, 3),
    (5, 'Very refreshing miso soup.', 4, 4),
    (1, 'Salmon nigiri was fresh and delicious!', 5, 5),
    (3, 'Vegetable ramen was a bit bland.', 3, 6),
    (2, 'Good bento but rice was a bit dry.', 3, 7),
    (4, 'Best matcha ice cream I have tried!', 5, 8);

-- Insert more mock data into RestReview
INSERT INTO RestReview (user_id, review, star_rating) VALUES 
    (1, 'Amazing ambiance and friendly staff!', 5),
    (2, 'Food was good but a bit pricey.', 4),
    (3, 'Loved the decor, very authentic!', 5),
    (4, 'Great experience, but service was slow.', 3),
    (5, 'Very cozy and inviting place.', 4);

-- Insert more mock data into Orders
INSERT INTO Orders (user_id, order_type, order_status) VALUES 
    (1, 'delivery', 'pending'),
    (2, 'pickup', 'in progress'),
    (3, 'delivery', 'delivered'),
    (4, 'pickup', 'delivered'),
    (5, 'delivery', 'in progress'),
    (1, 'delivery', 'delivered');

-- Insert more mock data into Reservations
INSERT INTO Reservations (user_id, reservation_date, reservation_time, guests) VALUES 
    (1, '2024-11-10', '18:30:00', 2),
    (2, '2024-11-11', '20:00:00', 4),
    (3, '2024-11-12', '19:15:00', 3),
    (4, '2024-11-13', '18:00:00', 5),
    (5, '2024-11-14', '19:30:00', 2),
    (1, '2024-11-15', '20:00:00', 4);

-- Insert more mock data into Allergens
INSERT INTO Allergens (menu_id, allergen_description) VALUES 
    (1, 'Contains raw fish'),
    (2, 'Contains gluten'),
    (3, 'Contains soy'),
    (4, 'Contains soy'),
    (5, 'Contains raw fish'),
    (6, 'Contains gluten'),
    (7, 'Contains gluten and soy'),
    (8, 'Contains dairy');

-- Insert more mock data into OrderItems
INSERT INTO OrderItems (order_id, menu_id, quantity, total_cost, comments) VALUES 
    (1, 1, 2, 51.98, 'Extra soy sauce, please.'),
    (1, 4, 1, 3.50, 'No green onions.'),
    (2, 3, 1, 14.75, 'Less salt.'),
    (2, 2, 1, 12.50, 'No modifications.'),
    (3, 5, 4, 23.96, 'Extra wasabi.'),
    (4, 6, 1, 9.50, 'Add chili flakes.'),
    (5, 7, 1, 16.25, 'Extra salad dressing.'),
    (6, 8, 2, 9.00, 'Add mochi on the side.');


-- Query to get all the reviews for a specific menu item
SELECT * FROM FoodReview WHERE menu_id = 1;

-- Query to get all the reviews for a specific user
SELECT * FROM FoodReview WHERE user_id = 1;

-- Query to get all the orders for a specific user
SELECT * FROM Orders WHERE user_id = 1;

-- Query to get all the reservations for a specific user
SELECT * FROM Reservations WHERE user_id = 1;

-- Query to get all the order items for a specific order
SELECT * FROM OrderItems WHERE order_id = 1;

-- Query to get all the allergens for a specific menu item
SELECT * FROM Allergens WHERE menu_id = 1;

-- Query to get the total number of reservations for a specific date
SELECT COUNT(*) FROM Reservations WHERE reservation_date = '2024-11-10';

-- Query to get the total number of orders for a specific status
SELECT COUNT(*) AS "Pending orders" FROM Orders WHERE order_status = 'pending';

-- Query to get the total cost of all order items for a specific order
SELECT SUM(total_cost) FROM OrderItems WHERE order_id = 1;

-- top rated menu items, average rating for each item with at least 2 reviews;
SELECT m.course_name, m.category, AVG(fr.star_rating) AS average_rating
FROM Menus m
JOIN FoodReview fr ON m.menu_id = fr.menu_id
GROUP BY m.menu_id
HAVING COUNT(fr.review_id) >= 1
ORDER BY average_rating DESC
LIMIT 5;


--- Some simple and more complex updates and deletions

-- update reservation time for a specific reservation
UPDATE Reservations
SET reservation_time = '19:00:00'
WHERE reservation_id = 1;

-- Update phone number
UPDATE Users
SET phone_number = '555-9999'
WHERE user_id = 2;

--delete a review
DELETE FROM FoodReview
WHERE review_id = 4;

-- Update order status after seven days
UPDATE Orders
SET order_status = 'delivered'
WHERE order_status = 'in progress'
AND created_at <= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY);

-- add allergen info for items containing soy
INSERT INTO Allergens (menu_id, allergen_description)
SELECT menu_id, 'Contains soy'
FROM Menus
WHERE course_name LIKE '%soy%';

-- delete all reviews for items that are no longer on the menu. fr = FoodReview, m = Menus (a shorthand for the tables)
DELETE fr
FROM FoodReview fr
LEFT JOIN Menus m ON fr.menu_id = m.menu_id
WHERE m.menu_id IS NULL;