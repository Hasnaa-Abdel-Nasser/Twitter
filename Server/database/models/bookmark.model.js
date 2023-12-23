import pool from "../dbConnection.js";

export const bookmark = async (userId, tweetId) => {
  if (await alreadybookmark(userId, tweetId)) {
    return removeFromBookmark(userId, tweetId);
  } else {
    return addToBookmark(userId, tweetId);
  }
};

export const alreadybookmark = async (userId, tweetId) => {
  const [bookmark] = await pool.query(`SELECT * FROM bookmarks WHERE user_id=? AND tweet_id=?;`, [userId, tweetId]);
  return bookmark.length > 0;
};

const removeFromBookmark = async (userId, tweetId) => {
  const [bookmark] = await pool.query(`DELETE FROM bookmarks WHERE user_id=? AND tweet_id=?;`,[userId, tweetId]);
  return successQuery(bookmark)
    ? {success: true , message: "Removed from the bookmark successfully." } 
    : {success: false , message:"Failed remove from the bookmark. Please try again later."};
};

const addToBookmark = async (userId, tweetId) => {
  const [bookmark] = await pool.query(`INSERT INTO bookmarks (user_id, tweet_id) VALUES(?,?);`,[userId, tweetId]);
  return successQuery(bookmark)
    ? {success: true , message: "Added to the bookmark successfully." } 
    : {success: false , message:"Failed add to the bookmark. Please try again later."};
};

const successQuery = (bookmark) => bookmark.affectedRows > 0;

