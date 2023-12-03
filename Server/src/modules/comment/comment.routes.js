import { Router } from "express";
import * as method from "./comment.controller.js";
import { userAuthentication } from "../../middleware/user.auth.js";

const commentRouter = new Router();

commentRouter.post(
    "/create",
    userAuthentication,
    method.addNewComment
);


export default commentRouter;
