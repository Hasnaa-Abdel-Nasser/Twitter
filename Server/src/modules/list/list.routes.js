import { Router } from "express";
import * as method from "./list.controller.js";
import { userAuthentication } from "../../middleware/user.auth.js";

const listRouter = new Router();

listRouter.post(
    "/create",
    userAuthentication,
    method.createNewList
);

listRouter.patch(
    "/info",
    userAuthentication,
    method.editListInfo
);

listRouter.patch(
    "/follow/:id",
    userAuthentication,
    method.manageFollowingList
);

listRouter.patch(
    "/member",
    userAuthentication,
    method.manageMembersList
);

listRouter.get(
    "/tweets",
    userAuthentication,
    method.getListTweets
);

listRouter.delete(
    "/delete/:id",
    userAuthentication,
    method.deleteList
);
export default listRouter;