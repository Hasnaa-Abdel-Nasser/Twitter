import pool from "../dbConnection.js";

export const newHashtags = async (tweetId, content) => {
  const hashtagRegex = /#(\w+)/g;
  const hashtagsArray = content.match(hashtagRegex) || [];
  for (const hashtag of hashtagsArray) {
    await pool.query(`INSERT INTO hashtags (tweet_id , hashtag) VALUES(? , ?);`,[tweetId, hashtag]);
  }
};

export const trends = async () => {
  const [trends] = await pool.query(`SELECT hashtag, COUNT(*) as count
                                      FROM Hashtags
                                      WHERE hashtag IS NOT NULL AND LENGTH(TRIM(hashtag)) > 0
                                      GROUP BY hashtag
                                      ORDER BY count DESC
                                      LIMIT 20;`);
  return trends;
}