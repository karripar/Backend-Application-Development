--- Create a new user in MySQL, replace 'myusername', 'mypassword', and 'databasename' with your own values
CREATE USER 'username'@'localhost' IDENTIFIED BY 'pw';
GRANT ALL PRIVILEGES ON `MediaSharingApp`.* TO 'username'@'localhost';
FLUSH PRIVILEGES;