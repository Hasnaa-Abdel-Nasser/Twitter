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
    verified TINYINT(1) DEFAULT 0,
    email_verified TINYINT(1) DEFAULT 0,
    code VARCHAR(6),
    password_changed_at DATETIME,
    create_code_time DATETIME
);

CREATE TABLE tweets ( -- is posts or comments or retweets with quote
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_by INT NOT NULL,
    content VARCHAR(300),
    like_count INT DEFAULT 0,
    retweet_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    tweet_type ENUM('tweet' , 'comment' , 'retweet') DEFAULT 'tweet',
    original_tweet_id INT,
    can_retweet ENUM('everyone', 'accounts_follow', 'verified_accounts', 'only_mention') DEFAULT 'everyone',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (original_tweet_id) REFERENCES tweets(id) ON DELETE SET NULL
);

CREATE TABLE retweets(
    created_by INT,
    tweet_id INT,
    retweet_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(created_by,tweet_id),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tweet_id) REFERENCES tweets(id) ON DELETE CASCADE
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

CREATE TABLE follow(
    following_id INT,
    follower_id INT,
    follow_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(following_id,follower_id),
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE likes(
    user_id INT ,
    tweet_id INT,
    like_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id,tweet_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tweet_id) REFERENCES tweets(id) ON DELETE CASCADE
);

CREATE TABLE bookmarks(
    user_id INT ,
    tweet_id INT,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id,tweet_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tweet_id) REFERENCES tweets(id) ON DELETE CASCADE
);
CREATE TABLE hashtags (
    hashtag_id INT AUTO_INCREMENT PRIMARY KEY,
    tweet_id INT,
    hashtag VARCHAR(20),
    FOREIGN KEY (tweet_id) REFERENCES tweets(id) ON DELETE CASCADE
);

CREATE TABLE lists(
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_by INT NOT NULL, 
    list_name VARCHAR(25) NOT NULL,
    description VARCHAR(100),
    list_state BOOLEAN DEFAULT true,
    photo_url VARCHAR(100),
    photo_public_id VARCHAR(100),
    members_number INT DEFAULT 0,
    followers INT DEFAULT 0
);

CREATE TABLE list_followers(
    list_id INT,
    user_id INT,
    PRIMARY KEY(list_id,user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
);

CREATE TABLE list_members(
    list_id INT,
    member_id INT,
    PRIMARY KEY(list_id,member_id),
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
);

CREATE TABLE notifications(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    send_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    message VARCHAR(50) NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    image_url VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);