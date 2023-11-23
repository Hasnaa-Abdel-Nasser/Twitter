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

CREATE TABLE tweets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tweet_content VARCHAR(300),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    like_count INT DEFAULT 0,
    retweet_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_by INT,
    media_count INT DEFAULT 0,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE media(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL ,
    tweet_id INT NOT NULL,
    url VARCHAR(100) NOT NULL,
    public_id VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tweet_id) REFERENCES tweets(id) ON DELETE CASCADE
);
