import pool from "../dbConnection.js";
import { getQuotes , updateTweetRetweets} from "./retweet.model.js";
import { newHashtags } from "./trend.model.js";
import {updateTweetComments} from "./comment.model.js";
import {uploadMedia} from './media.model.js';
export const getTweet = async (id) => {
  const [tweet] = await pool.query(`SELECT * FROM tweets WHERE id = ? AND tweet_type = 'tweet';`,[id]);
  return tweet;
};

export const createTweet = async (userId, content , canRetweet , media) => {
  const [tweet] = await pool.query(`INSERT INTO tweets (content  , created_by , can_retweet) 
                                    VALUES(? , ? , ?);`,[content, userId , canRetweet]);
  let [tweetId] = await pool.query(`SELECT LAST_INSERT_ID() AS last_inserted_tweet_id;`);
  tweetId = tweetId[0].last_inserted_tweet_id;
  if(content){
    await newHashtags( tweetId, content);
  }
  if(media){
    await uploadMedia(userId , tweetId , media);
  }
  return successQuery(tweet);
};

export const editTweet = async (userId, tweetId, content , canRetweet) => {
  const createTime = new Date();
  const [tweet] = await pool.query(`UPDATE tweets SET content = ? ,can_retweet=?, updated_at = ? WHERE id = ? AND created_by = ?`,[content,canRetweet, createTime, tweetId, userId]);
  return successQuery(tweet);
};

export const editViewsNumber = async(tweetId)=>{
  const [tweet] = await pool.query(`UPDATE tweets SET view_count = view_count + 1 WHERE id = ?`,[tweetId]);
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
            content ,
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

export const getAllTweetsAndQuotes = async(userId)=>{};

export const deleteTweet = async(userId , tweetId)=>{
   const [tweetDate] = await pool.query(`SELECT * FROM tweets WHERE id=? AND created_by = ?` , [tweetId , userId]);
   if(tweetDate.length && tweetDate[0].is_comment){
      await updateTweetComments(-1 , tweetDate[0].original_tweet_id)
    }else if(tweetDate.length && tweetDate[0].is_retweet){
      await updateTweetRetweets(-1 , tweetDate[0].original_tweet_id)
    }
    const [tweet] = await pool.query(`DELETE FROM tweets WHERE id = ? AND created_by = ?` , [tweetId , userId]);
    return successQuery(tweet);
};

const successQuery = (tweet) => tweet.affectedRows > 0;
