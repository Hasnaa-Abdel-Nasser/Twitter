import { Router } from "express";
import * as method from "./follow.controller.js";
import { userAuthentication } from "../../middleware/user.auth.js";

const followRouter = new Router();

followRouter.patch("/:follower_id", userAuthentication, method.follow);

followRouter.get("/followers", userAuthentication, method.allFollowers);

followRouter.get("/following", userAuthentication, method.allFollowing);

export default followRouter;
