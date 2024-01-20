import { resizeMedia } from "../../src/utils/files.uploads.js";
import pool from "../dbConnection.js";
import fs from 'fs/promises';
 
export const uploadMedia = async (userId, tweetId, medias) => {
  for (const media of medias) {
    const { url, publicId } = await resizeMedia(media, "tweets");
    await pool.query(
      `INSERT INTO media (user_id , tweet_id , url , public_id) VALUES(? , ? , ? , ?)`,
      [userId, tweetId, url, publicId]
    );
  }
};

export const deleteMedia = async (mediaId) => {
  const [media] = await pool.query(`DELETE FROM media WHERE id=?`, [mediaId]);
  return successQuery(media);
};

export const getMedia = async (mediaId) => {
  return await pool.query(`SELECT * FROM media WHERE id=?`, [mediaId]);
};

const successQuery = (media) => media.affectedRows > 0;
