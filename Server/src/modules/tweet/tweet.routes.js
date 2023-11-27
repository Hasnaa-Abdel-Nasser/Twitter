import { Router } from "express";
import * as method from "./tweet.controller.js";
import { validation } from "../../middleware/validation.js";
import * as tweetValidation from "./tweet.validation.js";
import { userAuthentication } from "../../middleware/user.auth.js";

const tweetRouter = new Router();

tweetRouter.post(
  "/create",
  userAuthentication,
  validation(tweetValidation.tweet),
  method.createTweet
);

tweetRouter.patch(
  "/content",
  userAuthentication,
  method.editTweetContent
);

tweetRouter.get(
  "/",
  userAuthentication,
  method.getUserTweets
);

tweetRouter.delete(
  "/delete/:id",
  userAuthentication,
  method.deleteTweet
);
export default tweetRouter;
