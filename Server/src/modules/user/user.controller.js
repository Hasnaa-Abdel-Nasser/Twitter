import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";
import sendEmail from '../../utils/email.validation.js';
import Jwt from "jsonwebtoken";
import * as query from '../../../database/models/user.model.js';
import cloudinary from "../../utils/cloudinary.js";
import pool from "../../../database/dbConnection.js";

export const register = catchError(async (req, res, next) => {
  try {
    const { name, email, password, birthDate } = req.body;
    // Check if the email already exists
    const [existingUser] = await pool.query(`SELECT * FROM users WHERE email = ?`,[email]);
    if (existingUser.length) return next(new AppError("This email already exists.", 400));
    const salt = await bcrypt.genSalt(+process.env.SALTROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Generate a unique code
    const code = customAlphabet("0123456789", 6)();
    // Insert the new user into the database
    if (!await query.insertNewUser(name , email , hashedPassword , birthDate , code)){
      next(new AppError("Please try again another time.", 500));
    }
    await sendEmail({email,name,code,message :'Thank you for signing up with our service! To complete your registration, please use the following verification code:'});
    res.status(200).json({message: "Check your email"});  
  } catch (error) {
    next(new AppError({ message: error.message }, 500));
  }
});

export const login = catchError(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [user] = await query.getUserData(email);
    if (!user.length || !(await bcrypt.compare(password, user[0].password))) {
      return next(new AppError("Incorrect email or password.", 400));
    }
    const code = customAlphabet("0123456789", 6)();
    if (!await query.updateVerifyCode(email , code)){
        return next(new AppError("Please try again another time.", 500));
    }
    await sendEmail({email,name: user[0].name,code , message:'Welcome to Twitter! We\'re excited to have you on board. To ensure the security of your account, please use the following verification code during your login:'});
    res.status(200).json({message: "Check your email"});
  } catch (error) {
    next(new AppError({ message: error.message }, 500));
  }
});

export const verifyCode = catchError(async (req , res , next)=>{
  try{
    const {email , code} = req.body;
    const [findUser] = await query.getUserCodeAndCreateTime(email , code);
    if(!findUser.length) return next(new AppError('Invalid code.' , 400));
    const isCodeValid = ifvalidateVerifyCode(findUser[0].create_code_time);
    if (!isCodeValid) {
      const newCode = customAlphabet("0123456789", 6)();
      if(!await query.updateVerifyCode(findUser[0].id , newCode)){
        return next(new AppError("Please try again another time.", 500));
      }
      return next(new AppError('Invalid code.', 400));
    }
    if(!await query.createEmailVerified(findUser[0].id))   return next(new AppError("Please try again another aime.", 500));
    let username;
    while(true){
      username = createUsername(findUser[0].name);
      const [user] = await query.getUsername(username);
      if(!user.length){
        await query.updateUsername(findUser[0].id , username);
        break;
      }
    }
    let token = Jwt.sign(
      {id : findUser[0].id, email : email, username: username},
      process.env.JWT_SECRET,
      { expiresIn: "90d" }
    );
    const cookieOperations = {
      expiresIn : new Date(Date.now() + process.env.COOKIE_EXPIRES * 24*60*60*1000),
      httpOnly:true
    }
    res.cookie("auth_token" , token , cookieOperations);
    res.status(200).json({ message: "Verification email sent successfully."});
  }catch(error){
    next(new AppError({ message: error.message }, 500));
  }
});

export const forgetPassword = catchError(async (req , res , next)=>{
  try{
    const {data} = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [user] = emailRegex.test(data) ? 
                   await pool.query(`SELECT * FROM users WHERE email = ?`,[data]) :
                   await query.getUsername(data);
    if(!user.length){
      return next(new AppError('Sorry, we could not find your account.', 400));
    }
    const code = customAlphabet("0123456789", 6)();
    if (!await query.updateVerifyCode(user[0].id , code)){
      return next(new AppError("Please try again another time.", 500));
    }
    await sendEmail({email:user[0].email,name: user[0].name,code,message:'We received a request to reset the password associated with this email address. If you made this request, Put this code to reset your password. If you didn\'t make this request, you can safely ignore this email.'});
    res.status(200).json({message: "Check your email"});
  }catch(error){
    next(new AppError({ message: error.message }, 500));
  }
});

export const changePassword = catchError(async (req , res , next)=>{
  try{
    const {password} = req.body;
    const salt = await bcrypt.genSalt(+process.env.SALTROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    if(! await query.updatePassword(req.user.id , hashedPassword)){
      return next(new AppError("Please try again another time.", 500));
    }
    res.status(200).json({message: 'Password changed successfully.'})
  }catch(error){
    next(new AppError({ message: error.message }, 500));
  }
});

export const updateProfileData = catchError(async (req , res , next)=>{
  try{
    const { bio = '', website = '', location = '' } = req.body;
    if(!isValidUrl(website)){
      return next(new AppError('Invalid website url' , 400));
    }
    if(!await query.updateProfile(req.user.id , bio , website , location)){
      return next(new AppError("Please try again another time.", 500));
    }
    res.status(200).json({message:'Update profile data successful.'});
  }catch(error){
    next(new AppError({ message: error.message }, 500));
  }
});

export const uploadProfileImage = catchError(async (req , res , next)=>{
  try{
    if (!req.file) return next(new AppError("Please upload profile image.", 400));
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "users",
    });
    if(!result.url || !await query.uploadImage(req.user.id , result.url , 'profile')){
      return next(new AppError("Please try again another time.", 500));
    }
    res.status(200).json({message : 'Upload profile image successful.'});
  }catch(error){
    next(new AppError({ message: error.message }, 500));
  }
});

export const uploadProfileCover = catchError(async (req , res , next)=>{
  try{
    if (!req.file) return next(new AppError("Please upload cover image.", 400));
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "users",
    });
    if(!result.url || !await query.uploadImage(req.user.id , result.url , 'cover')){
      return next(new AppError("Please try again another time.", 500));
    }
    res.status(200).json({message : 'Upload cover image successful.'});
  }catch(error){
    next(new AppError({ message: error.message }, 500));
  }
});

export const logout = catchError(async (req , res , next)=>{
  res.clearCookie('auth_token');
  res.status(200).json({ message: 'Logout successful' });
});

export const deleteAccount = catchError(async (req , res , next)=>{
  if(!await query.deleteAccount(req.user.id)){
    return next(new AppError("Please try again another time.", 500));
  }
  res.status(200).json({message : 'Delete account successful'});
})
function createUsername(name){
  const cleanedName = name.split(' ')[0];
  const randomSuffix = Math.floor(Math.random() * 1000);
  const username = `@${cleanedName.substring(0, 27)}${randomSuffix}`;
  return username;
}
function ifvalidateVerifyCode(updatedAt) {    
  const currentTime = new Date();
  const codeCreationTime = new Date(updatedAt);
  const timeDifference = Math.abs(currentTime - codeCreationTime);
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));
  console.log(minutesDifference)
  return minutesDifference <= 2;
}
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}