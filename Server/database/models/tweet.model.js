import pool from "../dbConnection.js";
import { getQuotes } from "./retweet.model.js";

export const getTweet = async (id) => {
  const [tweet] = await pool.query(
    `SELECT id , media_count FROM tweets WHERE id = ? AND is_retweet = 0 AND is_comment = 0`,
    [id]
  );
  return tweet;
};

export const createTweet = async (userId, content, mediaCount) => {
  const [tweet] = await pool.query(
    `INSERT INTO tweets (tweet_content , media_count , created_by) VALUES(? , ? , ?)`,
    [content, mediaCount, userId]
  );
  return successQuery(tweet);
};

export const editTweet = async (userId, tweetId, content) => {
  const createTime = new Date();
  const [tweet] = await pool.query(
    `UPDATE tweets SET tweet_content = ? , updated_at = ? WHERE id = ? AND created_by = ?`,
    [content, createTime, tweetId, userId]
  );
  return successQuery(tweet);
};

export const userPosts = () => {
  const tweets = `SELECT tweets.id AS id, 
            JSON_OBJECT(
              'id', users.id,
              'username', users.username,
              'name', users.name,
              'profileImage', users.profile_image,
              'verified', users.verified
            ) AS user,
            tweet_content AS content ,
            like_count AS likes, 
            retweet_count AS retweets,
            comment_count AS comments,
            view_count AS views , 
            created_at , 
            tweets.is_retweet AS isRetweet,
            (
                SELECT JSON_ARRAYAGG(JSON_OBJECT('id' , id,'url', url, 'publicId', public_id))
                FROM media
                WHERE tweet_id = tweets.id AND users.id = ?
            ) AS media,
            NULL AS original_tweet
    FROM tweets 
    JOIN users ON users.id = ?
    WHERE tweets.is_retweet = 0`;
  return tweets;
};

export const getAllTweetsAndQuotes = async(userId)=>{
  const [results] = await pool.query(`${userPosts()} 
                                     UNION 
                                     ${getQuotes()}
                                     ORDER BY created_at DESC` , [userId , userId , userId , userId]);
  return results;
}
export const deleteTweet = async(userId , tweetId)=>{
    const [tweet] = await pool.query(`DELETE FROM tweets WHERE id = ? AND created_by = ?` , [tweetId , userId]);
    return successQuery(tweet);
};

function successQuery(tweet) {
  return tweet.affectedRows > 0;
}
