import pool from "../dbConnection.js";

export async function getUserData(email){
    return await pool.query(`SELECT * FROM users WHERE email = ?`,[email]);
}

export async function insertNewUser(name, email, password, birthDate, code) {
    const createCodeTime = new Date();
  
    const [newUser] = await pool.query(
      `INSERT INTO users (name, email, password, birth_date, code, create_code_time) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, password, birthDate, code, createCodeTime]
    );
    return successQuery(newUser)
}

export async function updateVerifyCode(email , code){
    const createCodeTime = new Date();
    const [editCode] = await pool.query(
      `UPDATE users SET code = ? , create_code_time = ? WHERE email=?`,
      [code, createCodeTime ,email]
    );
    return successQuery(editCode)
}

export async function createEmailVerified(email){
    const [user] = await pool.query(`UPDATE users SET email_verified = 1 WHERE email = ?` , [email]);
    return successQuery(user)
}

export async function getUserCodeAndCreateTime(email, code) {
    return await pool.query(`SELECT code, create_code_time, name FROM users WHERE email = ? AND code = ?`, [email, code]);
}

export async function getUsername (username){
    return await pool.query(`SELECT * FROM users WHERE username=?` , [username]);
}   

export async function updateUsername (email , username){
    await pool.query(`UPDATE users SET username = ? WHERE email=?`,[username , email]);
}

export async function updatePassword (email , password){
    const [user] = await pool.query(`UPDATE users SET password = ? , password_changed_at = ? WHERE email=?`,[password , new Date() , email]);
    return successQuery(user)
}

export async function uploadImage (email , url , imageTitle){
    if(imageTitle == 'profile'){
        const [user] = await pool.query(`UPDATE users SET profile_image = ? WHERE email=?`,[url , email]);
        return successQuery(user)
    }else{
        const [user] = await pool.query(`UPDATE users SET profile_cover = ? WHERE email=?`,[url , email]);
        return successQuery(user)
    }
}

export async function updateProfile (email , bio , website , location){
    const [user] = await pool.query(`UPDATE users SET bio = ? , location=? , website=? WHERE email=?`,[bio , location , website, email]);
    return successQuery(user)
}

function successQuery (user){
    if(user.affectedRows) return true;
    return false;
}