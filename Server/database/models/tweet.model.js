import pool from "../dbConnection.js";

export const getTweet = async(id)=>{
    return await pool.query(`SELECT * FROM tweets WHERE id = ?` , [id]);
}

export const createTweet = async (userId ,content , mediaCount)=>{
    const [tweet] = await pool.query(`INSERT INTO tweets (tweet_content , media_count , created_by) VALUES(? , ? , ?)`, [content , mediaCount , userId]);
    return successQuery(tweet);
}

