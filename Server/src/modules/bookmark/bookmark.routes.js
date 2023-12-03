import { Router } from "express";
import * as method from "./bookmark.controller.js";
import { userAuthentication } from "../../middleware/user.auth.js";

const bookmartRouter = new Router();

bookmartRouter.put(
    "/:id" , 
    userAuthentication ,
    method.bookmark
);

bookmartRouter.get(
    "/profile", 
    userAuthentication ,
    method.userBookmarks
);

export default bookmartRouter;