import { Router } from "express";
import * as method from "./retweet.controller.js";
import { userAuthentication } from "../../middleware/user.auth.js";
import { validation } from "../../middleware/validation.js";
import * as tweetValidation from "../tweet/tweet.validation.js";
const retweetRouter = new Router();

retweetRouter.put(
    "/:id" , 
    userAuthentication ,
    method.retweet
);

retweetRouter.post(
    "/quote",
    userAuthentication,
    validation(tweetValidation.tweet),
    method.quote
);

retweetRouter.get(
    "/user",
    userAuthentication,
    method.getUserRetweetsAndQuotes
);

export default retweetRouter;