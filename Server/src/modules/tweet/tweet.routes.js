import { Router } from "express";
import * as method from "./tweet.controller.js";
import { validation } from "../../middleware/validation.js";
import * as tweetValidation from "./tweet.validation.js";
import { userAuthentication } from "../../middleware/user.auth.js";
import { MultiFile } from "../../utils/files.uploads.js";

const tweetRouter = new Router();
let MediaArray = [{ name: "media" ,maxCount: 4 }];

tweetRouter.post(
  "/create",
  userAuthentication,
  validation(tweetValidation.tweet),
  MultiFile(MediaArray),
  method.createTweet
);

tweetRouter.patch(
  "/content",
  userAuthentication,
  validation(tweetValidation.editTweet),
  method.editTweet
);

tweetRouter.get(
  "/",
  userAuthentication,
  method.getUserTweets
);

tweetRouter.patch(
  "/views/:id",
  method.editTweetViews
);

tweetRouter.delete(
  "/delete/:id",
  userAuthentication,
  method.deleteTweet
);
export default tweetRouter;
