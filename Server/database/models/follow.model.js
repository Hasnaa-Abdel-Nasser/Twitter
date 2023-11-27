import pool from "../dbConnection.js";

export const follow = async (followingId, followerId) => {
  const [follow] = await pool.query(`INSERT INTO follow (following_id , follower_id) VALUES(?,?)`,[followingId, followerId]);
  return successQuery(follow);
};

export const unfollow = async (followingId, followerId) => {
  const [follow] = await pool.query(`DELETE FROM follow WHERE following_id = ? AND follower_id = ? `,[followingId, followerId]);
  return successQuery(follow);
};

export const existsFollow = async (followingId, followerId) => {
  const [follow] = await pool.query(`SELECT * FROM follow WHERE following_id =? AND follower_id =?`,[followingId, followerId]);
  return follow.length > 0;
};

export const getFollowers = async (followingId) => {
  const [followers] = await pool.query(`SELECT users.id , users.name , users.profile_image , users.username , users.bio , users.verified
                                          FROM users
                                          JOIN follow ON users.id = follow.follower_id
                                          WHERE follow.following_id = ? `,[followingId]);
  return followers;
};

export const getFollowing = async (followingId) => {
  const [following] = await pool.query(`SELECT users.id , users.name , users.profile_image , users.username , users.bio , users.verified
                                          FROM users
                                          JOIN follow ON users.id = follow.following_id
                                          WHERE follow.follower_id = ? `,[followingId]);
  return following;
};

export const updateFollowingNumber = async (id , num) => {
  const [user] = await pool.query(`UPDATE users SET following = following + ? WHERE id=?`,[num , id]);
  return successQuery(user);
};

export const updateFollowersNumber = async (id , num) => {
  const [user] = await pool.query(`UPDATE users SET followers = followers + ? WHERE id=?`,[num , id]);
  return successQuery(user);
};

function successQuery(follow) {
  return follow.affectedRows > 0;
}
