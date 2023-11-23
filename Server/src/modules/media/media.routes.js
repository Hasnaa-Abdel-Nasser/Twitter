import { Router } from "express";
import * as method from "./media.controller.js";
import { userAuthentication } from "../../middleware/user.auth.js";
import { MultiFile } from "../../utils/files.uploads.js";

const mediaRouter = new Router();
let MediaArray = [{ name: "media" ,maxCount: 4 }];

mediaRouter.post(
    "/upload", 
    userAuthentication,
    MultiFile(MediaArray),
    method.uploadTweetMedia
);
mediaRouter.delete(
  "/delete/:id", 
  userAuthentication,
  method.deleteTweetMedia
);

export default mediaRouter;