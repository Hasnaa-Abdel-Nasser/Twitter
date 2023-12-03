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
  await updateTweetLikes(-1, tweetId);
  return {
    state: successQuery(like),
    message: "Cancel like successfully",
  };
};

const addLike = async (userId, tweetId) => {
  const [like] = await pool.query(`INSERT INTO likes (user_id, tweet_id) VALUES(?,?);`,[userId, tweetId]);
  await updateTweetLikes(1, tweetId);
  return { state: successQuery(like), message: "like successfully" };
};

export const updateTweetLikes = async (num, tweetId) => {
  const [like] = await pool.query(`UPDATE tweets SET like_count = like_count + ? WHERE id=?;`,[num, tweetId]);
  console.log(like);
  return successQuery(like);
};

function successQuery(like) {
  return like.affectedRows > 0;
}
