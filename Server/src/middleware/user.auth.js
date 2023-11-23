import Jwt, { decode } from "jsonwebtoken";
import {getUserData} from "../../database/models/user.model.js";
import { AppError } from "../utils/response.error.js";
import { catchError } from "./catch.errors.js";
import * as dotenv from "dotenv";
dotenv.config();

export const userAuthentication = catchError(async (req, res, next) => {
  const token = req.header("token");
  if (!token) return next(new AppError("Token expired", 401));
  Jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    } else {
      let [user] = await getUserData(decoded.id);
      if (!user.length) return next(new AppError("Invalid Token", 401));
      if(user[0].password_changed_at){
        let password_changed_at = parseInt(user[0].password_changed_at.getTime() / 1000);
        if (password_changed_at > decoded.iat)
        return next(new AppError("Invalid Token", 401));
      }
      req.user = user[0];
      next();
    }
  });
});