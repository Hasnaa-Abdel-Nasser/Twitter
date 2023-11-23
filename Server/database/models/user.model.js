import pool from "../dbConnection.js";

export async function getUserData(id){
    return await pool.query(`SELECT * FROM users WHERE id = ?`,[id]);
}

export async function insertNewUser(name, email, password, birthDate, code) {
    const createCodeTime = new Date();
  
    const [newUser] = await pool.query(
      `INSERT INTO users (name, email, password, birth_date, code, create_code_time) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, password, birthDate, code, createCodeTime]
    );
    return successQuery(newUser)
}

export async function updateVerifyCode(id , code){
    const createCodeTime = new Date();
    const [editCode] = await pool.query(
      `UPDATE users SET code = ? , create_code_time = ? WHERE id=?`,
      [code, createCodeTime ,id]
    );
    return successQuery(editCode)
}

export async function createEmailVerified(id){
    const [user] = await pool.query(`UPDATE users SET email_verified = 1 WHERE id = ?` , [id]);
    return successQuery(user)
}

export async function getUserCodeAndCreateTime(email, code) {
    return await pool.query(`SELECT id , code, create_code_time, name FROM users WHERE email = ? AND code = ?`, [email, code]);
}

export async function getUsername (username){
    return await pool.query(`SELECT * FROM users WHERE username=?` , [username]);
}   

export async function updateUsername (id , username){
    await pool.query(`UPDATE users SET username = ? WHERE id=?`,[username , id]);
}

export async function updatePassword (id , password){
    const [user] = await pool.query(`UPDATE users SET password = ? , password_changed_at = ? WHERE id=?`,[password , new Date() , id]);
    return successQuery(user)
}

export async function uploadImage (id , url , imageTitle){
    if(imageTitle == 'profile'){
        const [user] = await pool.query(`UPDATE users SET profile_image = ? WHERE id=?`,[url , id]);
        return successQuery(user)
    }else{
        const [user] = await pool.query(`UPDATE users SET profile_cover = ? WHERE id=?`,[url , id]);
        return successQuery(user)
    }
}

export async function updateProfile (id , bio , website , location){
    const [user] = await pool.query(`UPDATE users SET bio = ? , location=? , website=? WHERE id=?`,[bio , location , website, id]);
    return successQuery(user)
}

export async function deleteAccount (id){
    const [user] = await pool.query(`DELETE FROM users WHERE id=?`,[id]);
    return successQuery(user);
}
function successQuery (user){
    if(user.affectedRows) return true;
    return false;
}