import pool from "../dbConnection.js";
import { newHashtags } from "./trend.model.js";

export const alreadyRetweet = async (userId, tweetId) => {
  const [retweet] = await pool.query(
    `SELECT * FROM retweets WHERE created_by=? AND tweet_id=?;`,
    [userId, tweetId]
  );
  return retweet.length > 0;
};

export const retweet = async (userId, tweetId) => {
  if (await alreadyRetweet(userId, tweetId)) {
    return cancelRetweet(userId, tweetId);
  } else {
    return addRetweet(userId, tweetId);
  }
};

const cancelRetweet = async (userId, tweetId) => {
  const [retweet] = await pool.query(
    `DELETE FROM retweets WHERE created_by=? AND tweet_id=?;`,
    [userId, tweetId]
  );
  await updateTweetRetweets(-1, tweetId);
  return {
    state: successQuery(retweet),
    message: "Cancel retweet successfully",
  };
};

const addRetweet = async (userId, tweetId) => {
  const [retweet] = await pool.query(
    `INSERT INTO retweets (created_by, tweet_id) VALUES(?,?);`,
    [userId, tweetId]
  );
  await updateTweetRetweets(1, tweetId);
  return { state: successQuery(retweet), message: "Retweet successfully" };
};

export const updateTweetRetweets = async (num, tweetId) => {
  const [tweet] = await pool.query(
    `UPDATE tweets SET retweet_count = retweet_count + ? WHERE id=?;`,
    [num, tweetId]
  );
  return successQuery(tweet);
};

export const quote = async (userId, tweetId, content, mediaCount) => {
  const [quote] = await pool.query(
    `INSERT INTO tweets (created_by , original_tweet_id ,  tweet_content , media_count, is_retweet) 
                                      VALUES (?,?,?,?,?);`,
    [userId, tweetId, content, mediaCount, 1]
  );
  const [tweet] = await pool.query(`SELECT LAST_INSERT_ID() AS last_inserted_tweet_id;`);
  if(content){
    await newHashtags(tweet[0].last_inserted_tweet_id, content);
  }
  await updateTweetRetweets(1 , tweetId);
  return successQuery(quote);
};

export const userRetweetsAndQuotes = async (userId) => {
  const [results] = await pool.query(`${getRetweetList()} 
                                     UNION 
                                     ${getQuotes()}
                                     ORDER BY created_at DESC`,
    [userId, userId, userId, userId]
  );
  return results;
};

export const getRetweetList = () => {
  const retweets = `
    SELECT 
        tweets.id AS id,
        NULL AS user,
        tweets.tweet_content AS content,
        tweets.like_count AS likes,
        tweets.retweet_count AS retweets,
        tweets.comment_count AS comments,
        tweets.view_count AS views,
        tweets.created_at AS created_at,
        tweets.is_retweet AS isRetweet,
        NULL AS media,
        NULL AS original_tweet
    FROM retweets 
    JOIN tweets ON tweet_id = tweets.id
    JOIN users ON users.id = retweets.created_by
    WHERE retweets.created_by=?`;
  return retweets;
};

export const getQuotes = () => {
  const quotes = `
      SELECT
          tweets.id AS id,
          JSON_OBJECT(
              'id', user.id,
              'username', user.username,
              'name', user.name,
              'profileImage', user.profile_image,
              'verified', user.verified
          ) AS user,
          tweets.tweet_content AS content,
          tweets.like_count AS likes,
          tweets.retweet_count AS retweets,
          tweets.comment_count AS comments,
          tweets.view_count AS views,
          tweets.created_at AS created_at, 
          tweets.is_retweet AS isRetweet,
          (
              SELECT JSON_ARRAYAGG(JSON_OBJECT('id' , id,'url', url, 'publicId', public_id))
              FROM media
              WHERE tweet_id = tweets.id AND user_id = ?
          ) AS media,
          CASE 
            WHEN tweets.original_tweet_id IS NULL THEN NULL
            ELSE JSON_OBJECT(
              'id', original_tweet.id,
              'content', original_tweet.tweet_content,
              'created_at', original_tweet.created_at,        
              'user', JSON_OBJECT(
                  'id', original_user.id,
                  'username', original_user.username,
                  'name', original_user.name,
                  'profileImage', original_user.profile_image,
                  'verified', original_user.verified
               )
            )
          END AS original_tweet
      FROM tweets
      JOIN tweets AS original_tweet 
          ON (tweets.original_tweet_id = original_tweet.id AND tweets.is_retweet = 1) 
          OR (tweets.original_tweet_id IS NULL AND tweets.is_retweet = 1)
      JOIN users AS original_user ON original_tweet.created_by = original_user.id
      JOIN users AS user ON tweets.created_by = user.id
      WHERE tweets.created_by = ?`;
  return quotes;
};

function successQuery(retweet) {
  return retweet.affectedRows > 0;
}
