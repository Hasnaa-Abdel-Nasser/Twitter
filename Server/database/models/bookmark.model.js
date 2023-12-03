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
  return {
    state: successQuery(bookmark),
    message: "Remove From Bookmark successfully",
  };
};

const addToBookmark = async (userId, tweetId) => {
  const [bookmark] = await pool.query(`INSERT INTO bookmarks (user_id, tweet_id) VALUES(?,?);`,[userId, tweetId]);
  return { state: successQuery(bookmark), message: "Add To Bookmark successfully" };
};

function successQuery(bookmark) {
  return bookmark.affectedRows > 0;
}
