import { Router } from "express";
import * as method from "./media.controller.js";
import { userAuthentication } from "../../middleware/user.auth.js";

const mediaRouter = new Router();

mediaRouter.delete(
  "/delete/:id", 
  userAuthentication,
  method.deleteTweetMedia
);

export default mediaRouter;