import { Router } from "express";
import * as method from "./likes.controller.js";
import { userAuthentication } from "../../middleware/user.auth.js";

const likeRouter = new Router();

likeRouter.put(
    "/:id" , 
    userAuthentication ,
    method.like
);

likeRouter.get(
    "/", 
    userAuthentication ,
    method.tweetLikes
);

likeRouter.get(
    "/profile", 
    userAuthentication ,
    method.userLikes
);

export default likeRouter;