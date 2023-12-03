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
    "/state",
    userAuthentication,
    method.editListState
);

listRouter.delete(
    "/remove-photo/:id",
    userAuthentication,
    method.removeListPhoto
);

listRouter.patch(
    "/member",
    userAuthentication,
    method.manageMemberList
);

listRouter.patch(
    "/follow",
    userAuthentication,
    method.manageFollowList
);

listRouter.get(
    "/tweets",
    userAuthentication,
    method.getListTweets
);

listRouter.delete(
    "/:id",
    userAuthentication,
    method.deleteList
);
export default listRouter;