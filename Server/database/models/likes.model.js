import pool from "../dbConnection.js";

export const like = async (userId, tweetId) => {
  if (await alreadyLike(userId, tweetId)) {
    return cancelLike(userId, tweetId);
  } else {
    return addLike(userId, tweetId);
  }
};

export const alreadyLike = async (userId, tweetId) => {
  const [like] = await pool.query(`SELECT * FROM likes WHERE user_id=? AND tweet_id=?;`, [userId, tweetId]);
  return like.length > 0;
};

const cancelLike = async (userId, tweetId) => {
  const [like] = await pool.query(`DELETE FROM likes WHERE user_id=? AND tweet_id=?;`,[userId, tweetId]);
  successQuery(like) && await updateTweetLikes(-1, tweetId);
  return successQuery(like)
    ? {success: true , message: "Cancel your like successfully." } 
    : {success: false , message:"Failed unlike on tweet. Please try again later."};
};

const addLike = async (userId, tweetId) => {
  const [like] = await pool.query(`INSERT INTO likes (user_id, tweet_id) VALUES(?,?);`,[userId, tweetId]);
  successQuery(like) && await updateTweetLikes(1, tweetId);
  return successQuery(like)
    ? {success: true , message: "like on tweet successfully." } 
    : {success: false , message:"Failed to like on tweet. Please try again later."};
};

export const updateTweetLikes = async (num, tweetId) => {
  const [like] = await pool.query(`UPDATE tweets SET like_count = like_count + ? WHERE id=? AND like_count + ? >= 0;`,[num, tweetId , num]);
  console.log(like);
  return successQuery(like);
};

const successQuery = (like) => like.affectedRows > 0;

