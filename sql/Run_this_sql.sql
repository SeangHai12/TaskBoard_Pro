CREATE DATABASE IF NOT EXISTS taskboard_pro;
CREATE USER IF NOT EXISTS 'taskboard'@'localhost' IDENTIFIED BY 'taskboard_pw';
GRANT ALL PRIVILEGES ON taskboard_pro.* TO 'taskboard'@'localhost';
FLUSH PRIVILEGES;