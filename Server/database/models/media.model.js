import pool from "../dbConnection.js";

export const updateMediaCount = async (tweetId , mediaCount)=>{
    const [tweet] = await pool.query(`UPDATE tweets SET media_count = media_count + ? WHERE id = ? AND media_count + ? >= 0`, [mediaCount , tweetId]);
    return successQuery(tweet);
}

export const uploadMedia = async (userId , tweetId , url , publicId )=>{
    await pool.query(`INSERT INTO media (user_id , tweet_id , url , public_id) VALUES(? , ? , ? , ?)`,[userId , tweetId , url , publicId]);
}

export const deleteMedia = async (mediaId)=>{
    const [media] = await pool.query(`DELETE FROM media WHERE id=?` , [mediaId]);
    return successQuery(media);
}

export const getMedia = async (mediaId)=>{
    return await pool.query(`SELECT * FROM media WHERE id=?` , [mediaId]);
}

const successQuery = (media) => media.affectedRows > 0;
