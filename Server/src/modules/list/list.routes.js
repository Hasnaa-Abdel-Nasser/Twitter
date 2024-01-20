import { Router } from "express";
import * as method from "./list.controller.js";
import { userAuthentication } from "../../middleware/user.auth.js";
import { validation } from "../../middleware/validation.js";
import * as dataValidation from "./list.validation.js";
import { SingleFile } from "../../utils/files.uploads.js";

const listRouter = new Router();

listRouter.post(
    "/create",
    userAuthentication,
    validation(dataValidation.newList),
    method.createNewList
);

listRouter.put(
    "/cover",
    userAuthentication,
    SingleFile("image"),
    method.uploadListImage
);

listRouter.patch(
    "/info",
    userAuthentication,
    validation(dataValidation.editList),
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
    validation(dataValidation.memberList),
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