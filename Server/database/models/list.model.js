import pool from "../dbConnection.js";

export const findList = async(id , userId)=>{
  const [list] = await pool.query(`SELECT list_name , description , list_state FROM lists WHERE id=? AND created_by=?`,[id,userId]);
  return list.length > 0 && list[0];
}

// New List
export const newList = async (userId, listName, description, listState) => {
  const [list] = await pool.query(`INSERT INTO lists (created_by, list_name , description , list_state)
                                   VALUES (?,?,?,?)`,[userId, listName, description, listState]);
  return successQuery(list)
  ? { success: true, message: 'List created successfully.' }
  : { success: false, message: 'Failed to create the list. Please try again later.' };
};

//Edit List
export const editList = async (id , userId, listName, description, listState)=>{
  const [list] = await pool.query(`UPDATE lists 
                                   SET list_name = ? , description = ? ,list_state = ? 
                                   WHERE id = ? AND created_by = ?;`,
                                   [listName, description, listState , id , userId]);
  return successQuery(list)
    ? { success: true, message: 'List edited successfully.' }
    : { success: false, message: 'Failed to edit the list. Please try again later.' };
};

// Manage Following List: 
export const findUser = async (id , userId)=>{ // Check If User Already Following List
  const [user] = await pool.query(`SELECT * FROM list_followers WHERE list_id = ? AND user_id = ?;`,[id, userId]);
  return user.length > 0;
};

export const followList = async (id , userId) => {
  const [follow] = await pool.query(`INSERT INTO list_followers (list_id , user_id) VALUES(?,?)`,[id, userId]);
  successQuery(follow) && await updateFollowersListNumber(id , 1);
  return successQuery(follow)
    ? {success: true , message: "Followed the list successfully." } 
    : {success: false , message:"Failed to follow the list. Please try again later."};
};

export const unfollowList = async (id, userId) => {
  const [follow] = await pool.query(`DELETE FROM list_followers WHERE list_id = ? AND user_id = ? `,[id, userId]);
  const success = successQuery(follow) ;
  if(success){
    await updateFollowersListNumber(id , -1);
  }
  return success 
    ? {success: true , message: "Unfollowed the list successfully."} 
    : {success: false , message:"Failed to unfollow the list. Please try again later."};
};

export const updateFollowersListNumber = async (id , num) => {
  await pool.query(`UPDATE lists SET followers = followers + ? WHERE id=?`,[num , id]);
};

//Manage Members
export const listMember = async (id , memberId) => { // Check Member If Added or Not
  const [user] = await pool.query(`SELECT * FROM list_members WHERE list_id = ? AND member_id = ? ;`,[id, memberId]);
  return user.length > 0;
};

export const addMember = async(id , memberId)=>{
  const [list] = await pool.query(`INSERT INTO list_members (list_id , member_id) VALUES(?,?);` , [id , memberId]);
  successQuery(list) && await updateListMembersNumber(id , 1);
  return successQuery(list)
    ? {success: true , message: "Member added successfully." } 
    : {success: false , message:"Failed add member to the list. Please try again later."};
};

export const removeMember = async(id , memberId) => {
  const [list] = await pool.query(`DELETE FROM list_members WHERE list_id=? AND member_id = ? ` , [id , memberId]);
  successQuery(list) && await updateListMembersNumber(id , -1);
  return successQuery(list)
    ? {success: true , message: "Member removed successfully." } 
    : {success: false , message:"Failed remove member from the list. Please try again later."};
};

export const updateListMembersNumber = async (id , num) => {
  await pool.query(`UPDATE lists SET members_number = members_number + ? WHERE id=?`,[num , id]);
};

//Delete List And Members 
export const deleteList = async(id , userId)=>{
  const [list] = await pool.query(`DELETE FROM lists WHERE id=? AND created_by = ?` , [id , userId]);
  return successQuery(list)
  ? { success: true, message: 'Delete list successfully.' }
  : { success: false, message: 'Failed to delete the list. Please try again later.' };
};

export const listCover = async(id , userId , url , public_id)=>{
  const [list] = await pool.query(`UPDATE users SET photo_url = ? , photo_public_id = ? WHERE id=? AND created_by = ?` , [url , public_id , id , userId]);
  return successQuery(list);
};

const successQuery = (list) => list.affectedRows > 0;
