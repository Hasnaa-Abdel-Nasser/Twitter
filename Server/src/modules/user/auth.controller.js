import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";
import sendEmail from "../../utils/email.validation.js";
import Jwt from "jsonwebtoken";
import * as query from "../../../database/models/user.model.js";
import pool from "../../../database/dbConnection.js";

export const register = catchError(async (req, res, next) => {
  const { name, email, password, birthDate } = req.body;
  // Check if the email already exists
  const [existingUser] = await pool.query(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  if (existingUser.length) {
    return next(new AppError("This email already exists.", 400));
  }
  const salt = await bcrypt.genSalt(+process.env.SALTROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Generate a unique code
  const code = customAlphabet("0123456789", 6)();
  // Insert the new user into the database
  if (
    !(await query.insertNewUser(name, email, hashedPassword, birthDate, code))
  ) {
    next(new AppError("Please try again another time.", 500));
  }
  await sendEmail({ email, name, code, emailType: "register" });
  res.status(200).json({ message: "Check your email" });
});

export const login = catchError(async (req, res, next) => {
  const { email, password } = req.body;
  const [user] = await query.getUserData(email);
  if (!user.length || !(await bcrypt.compare(password, user[0].password))) {
    return next(new AppError("Incorrect email or password.", 400));
  }
  const code = customAlphabet("0123456789", 6)();
  if (!(await query.updateVerifyCode(email, code))) {
    return next(new AppError("Please try again another time.", 500));
  }
  await sendEmail({ email, name: user[0].name, code, emailType: "login" });
  res.status(200).json({ message: "Check your email" });
});

export const verifyCode = catchError(async (req, res, next) => {
  try {
    const { email, code } = req.body;

    // Check if the user exists with the provided code
    const [findUser] = await query.getUserCodeAndCreateTime(email, code);

    if (!findUser.length) {
      return next(new AppError("Invalid code.", 400));
    }

    // Check if the code is still valid
    const isCodeValid = ifvalidateVerifyCode(findUser[0].create_code_time);

    if (!isCodeValid) {
      // If not valid, generate a new code
      const newCode = customAlphabet("0123456789", 6)();

      // Update the user's code
      if (!(await query.updateVerifyCode(findUser[0].id, newCode))) {
        return next(new AppError("Please try again another time.", 500));
      }

      return next(new AppError("Invalid code. New code sent.", 400));
    }

    // Mark the user as email verified
    if (!(await query.createEmailVerified(findUser[0].id))) {
      return next(
        new AppError("Failed to verify email. Please try again.", 500)
      );
    }

    // Generate a unique username for the user
    let username;
    while (true) {
      username = createUsername(findUser[0].name);
      const [user] = await query.getUsername(username);
      if (!user.length) {
        await query.updateUsername(findUser[0].id, username);
        break;
      }
    }

    // Generate and sign a JWT token
    const tokenPayload = { id: findUser[0].id, email, username };
    const token = Jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });

    // Set the token as a cookie
    const cookieOptions = {
      expiresIn: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    res.cookie("auth_token", token, cookieOptions);

    res.status(200).json({ message: "Verification successful. Token set." });
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    return next(new AppError("An unexpected error occurred.", 500));
  }
});

export const forgetPassword = catchError(async (req, res, next) => {
  const { data } = req.body; //data is email or username
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [user] = emailRegex.test(data)
    ? await pool.query(`SELECT * FROM users WHERE email = ?`, [data])
    : await query.getUsername(data);
  if (!user.length) {
    return next(new AppError("Sorry, we could not find your account.", 400));
  }
  const code = customAlphabet("0123456789", 6)();
  if (!(await query.updateVerifyCode(user[0].id, code))) {
    return next(new AppError("Please try again another time.", 500));
  }
  await sendEmail({
    email: user[0].email,
    name: user[0].name,
    code,
    emailType: "forgetPassword",
  });
  res.status(200).json({ message: "Check your email" });
});

export const changePassword = catchError(async (req, res, next) => {
  const { password } = req.body;
  const salt = await bcrypt.genSalt(+process.env.SALTROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  if (!(await query.updatePassword(req.user.id, hashedPassword))) {
    return next(new AppError("Please try again another time.", 500));
  }
  res.status(200).json({ message: "Password changed successfully." });
});

export const logout = catchError(async (req, res, next) => {
  res.clearCookie("auth_token");
  res.status(200).json({ message: "Logout successful" });
});

export const deleteAccount = catchError(async (req, res, next) => {
  if (!(await query.deleteAccount(req.user.id))) {
    return next(new AppError("Please try again another time.", 500));
  }
  res.status(200).json({ message: "Delete account successful" });
});
function createUsername(name) {
  const cleanedName = name.split(" ")[0];
  const randomSuffix = Math.floor(Math.random() * 1000);
  const username = `@${cleanedName.substring(0, 27)}${randomSuffix}`;
  return username;
}
function ifvalidateVerifyCode(updatedAt) {
  const currentTime = new Date();
  const codeCreationTime = new Date(updatedAt);
  const timeDifference = Math.abs(currentTime - codeCreationTime);
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));
  console.log(minutesDifference);
  return minutesDifference <= 2;
}
