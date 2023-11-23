import { Router } from "express";
import * as method from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import * as dataValidation from "./user.validation.js";
import { userAuthentication } from "../../middleware/user.auth.js";
import { SingleFile } from "../../utils/files.uploads.js";
const authRouter = new Router();

authRouter.post(
  "/register",
  validation(dataValidation.registerData),
  method.register
);
authRouter.post(
    "/login", 
    validation(dataValidation.loginData),
    method.login
);
authRouter.post(
    "/verify", 
    method.verifyCode
);
authRouter.post(
    "/forget-password", 
    method.forgetPassword
);
authRouter.patch(
    "/change-password",
    userAuthentication, 
    method.changePassword
);
authRouter.patch(
  "/profile-image",
  userAuthentication,
  SingleFile("image"),
  method.uploadProfileImage
);
authRouter.patch(
  "/cover-image",
  userAuthentication,
  SingleFile("image"),
  method.uploadProfileImage
);
authRouter.put(
    "/profile-data", 
    userAuthentication, 
    method.updateProfileData
);
authRouter.get(
    "/logout",
    method.logout
);
authRouter.get(
  "/delete-account",
  method.deleteAccount
);
export default authRouter;
