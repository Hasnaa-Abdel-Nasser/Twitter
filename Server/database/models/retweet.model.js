import pool from "../dbConnection.js";
import { newHashtags } from "./trend.model.js";

export const alreadyRetweet = async (userId, tweetId) => {
  const [retweet] = await pool.query(`SELECT * FROM retweets WHERE created_by=? AND tweet_id=?;`,[userId, tweetId]);
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
  const [retweet] = await pool.query(`DELETE FROM retweets WHERE created_by=? AND tweet_id=?;`,[userId, tweetId]);
  successQuery(retweet) && await updateTweetRetweets(-1, tweetId);
  return successQuery(retweet)
    ? {success: true , message: "Successfully cancel the retweet." } 
    : {success: false , message:"Failed to cancel the retweet. Please try again later."};
};

const addRetweet = async (userId, tweetId) => {
  const [retweet] = await pool.query(`INSERT INTO retweets (created_by, tweet_id) VALUES(?,?);`,[userId, tweetId]);
  successQuery(retweet) && await updateTweetRetweets(1, tweetId);
  return successQuery(retweet)
    ? {success: true , message: "Successfully retweet." } 
    : {success: false , message:"Failed to retweet. Please try again later."};
};

export const updateTweetRetweets = async (num, tweetId) => {
  await pool.query(`UPDATE tweets SET retweet_count = retweet_count + ? WHERE id=? AND retweet_count + ? >= 0;`,[num, tweetId , num]);
};

export const quote = async (userId, tweetId, content , canRetweet) => {
  const [quote] = await pool.query(`INSERT INTO tweets (created_by , original_tweet_id ,  content , tweet_type , can-retweet) 
                                    VALUES (?,?,?,?,?);`,[userId, tweetId, content, 'retweet' , canRetweet]);
  const [tweet] = await pool.query(`SELECT LAST_INSERT_ID() AS last_inserted_tweet_id;`);
  if(content){
    await newHashtags(tweet[0].last_inserted_tweet_id, content);
  }
  successQuery(quote) && await updateTweetRetweets(1, tweetId);
  return successQuery(quote)
    ? {success: true , message: "Tweet created successfully" } 
    : {success: false , message:"Failed to create tweet. Please try again later."};
};

export const userRetweetsAndQuotes = async (userId) => {};

export const getRetweetList = () => {};

export const getQuotes = () => {};

const successQuery = (retweet) => retweet.affectedRows > 0;
