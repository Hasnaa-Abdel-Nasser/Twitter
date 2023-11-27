import { Router } from "express";
import * as method from "./retweet.controller.js";
import { userAuthentication } from "../../middleware/user.auth.js";

const retweetRouter = new Router();

retweetRouter.put(
    "/:id" , 
    userAuthentication ,
    method.retweet
);

retweetRouter.post(
    "/quote",
    userAuthentication,
    method.quote
);

retweetRouter.get(
    "/user",
    userAuthentication,
    method.getUserRetweetsAndQuotes
);

export default retweetRouter;