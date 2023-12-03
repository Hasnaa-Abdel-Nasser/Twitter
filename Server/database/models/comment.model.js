import pool from "../dbConnection.js";

export const addComment = async (userId, tweetId, content, mediaCount) => {
  const [comment] = await pool.query(`INSERT INTO tweets (created_by , original_tweet_id ,  tweet_content , media_count, is_comment) 
                                      VALUES (?,?,?,?,?);`,
    [userId, tweetId, content, mediaCount, 1]
  );
  await updateTweetComments(tweetId);
  return successQuery(comment);
};

export const updateTweetComments = async (tweetId) => {
  const x = await pool.query(`UPDATE tweets SET comment_count = comment_count + 1 WHERE id=?;`,[tweetId]);
  console.log(x)
};

function successQuery(comment) {
  return comment.affectedRows > 0;
}
