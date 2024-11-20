--- Create a new user in MySQL, replace 'myusername', 'mypassword', and 'databasename' with your own values
CREATE USER 'karripar'@'localhost' IDENTIFIED BY 'Dortmund-1909';
GRANT ALL PRIVILEGES ON `MediaSharingApp`.* TO 'karripar'@'localhost';
FLUSH PRIVILEGES;