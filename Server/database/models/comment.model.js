import pool from "../dbConnection.js";

export const addComment = async (userId, tweetId, content, mediaCount) => {
  const [comment] = await pool.query(`INSERT INTO tweets (created_by , original_tweet_id ,  tweet_content , media_count, is_comment) 
                                      VALUES (?,?,?,?,?);`,
    [userId, tweetId, content, mediaCount, 1]
  );
  successQuery(comment) && await updateTweetComments( 1 , tweetId);
  return successQuery(comment);
};

export const updateTweetComments = async (num , tweetId) => {
  await pool.query(`UPDATE tweets SET comment_count = comment_count + ? WHERE id=? AND comment_count + ? >= 0 ;`,[num , tweetId , num]);
};

const successQuery = (comment) => comment.affectedRows > 0;

