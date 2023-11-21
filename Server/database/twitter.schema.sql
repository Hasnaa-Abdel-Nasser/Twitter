use twitter_db;
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(30) NOT NULL,
    username VARCHAR(30) UNIQUE,
    password VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    profile_image VARCHAR(100),
    profile_cover VARCHAR(100),
    following INT DEFAULT 0,
    followers INT DEFAULT 0,
    bio VARCHAR(100),
    location VARCHAR(50),
    website VARCHAR(100),
    email_verified TINYINT(1) DEFAULT 0,
    code VARCHAR(6),
    password_changed_at DATETIME,
    create_code_time DATETIME
);
use twitter_db;

drop table users;
use twitter_db;

SELECT * FROM users;
use twitter_db;

DELETE FROM users WHERE email = 'hasnaa8976@gmail.com';