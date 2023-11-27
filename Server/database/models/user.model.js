import pool from "../dbConnection.js";

export const getUserData = async (id) => {
  return await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
};

export const insertNewUser = async (name, email, password, birthDate, code) => {
  const createCodeTime = new Date();

  const [newUser] = await pool.query(
    `INSERT INTO users (name, email, password, birth_date, code, create_code_time) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email, password, birthDate, code, createCodeTime]
  );
  return successQuery(newUser);
};

export const updateVerifyCode = async (id, code) => {
  const createCodeTime = new Date();
  const [editCode] = await pool.query(
    `UPDATE users SET code = ? , create_code_time = ? WHERE id=?`,
    [code, createCodeTime, id]
  );
  return successQuery(editCode);
};

export const createEmailVerified = async (id) => {
  const [user] = await pool.query(
    `UPDATE users SET email_verified = 1 WHERE id = ?`,
    [id]
  );
  return successQuery(user);
};

export const getUserCodeAndCreateTime = async (email, code) => {
  return await pool.query(
    `SELECT id , code, create_code_time, name FROM users WHERE email = ? AND code = ?`,
    [email, code]
  );
};

export const getUsername = async (username) => {
  return await pool.query(`SELECT * FROM users WHERE username=?`, [username]);
};

export const updateUsername = async (id, username) => {
  await pool.query(`UPDATE users SET username = ? WHERE id=?`, [username, id]);
};

export const updatePassword = async (id, password) => {
  const [user] = await pool.query(
    `UPDATE users SET password = ? , password_changed_at = ? WHERE id=?`,
    [password, new Date(), id]
  );
  return successQuery(user);
};

export const uploadImage = async (id, url, imageTitle) => {
  if (imageTitle == "profile") {
    const [user] = await pool.query(
      `UPDATE users SET profile_image = ? WHERE id=?`,
      [url, id]
    );
    return successQuery(user);
  } else {
    const [user] = await pool.query(
      `UPDATE users SET profile_cover = ? WHERE id=?`,
      [url, id]
    );
    return successQuery(user);
  }
};

export const updateProfile = async (id, bio, website, location) => {
  const [user] = await pool.query(
    `UPDATE users SET bio = ? , location=? , website=? WHERE id=?`,
    [bio, location, website, id]
  );
  return successQuery(user);
};

export const deleteAccount = async (id) => {
  const [user] = await pool.query(`DELETE FROM users WHERE id=?`, [id]);
  return successQuery(user);
};
function successQuery(user) {
  return user.affectedRows > 0;
}
