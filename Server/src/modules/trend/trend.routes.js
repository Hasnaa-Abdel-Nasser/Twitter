import { Router } from "express";
import * as method from "./trend.controller.js";
import { userAuthentication } from "../../middleware/user.auth.js";

const trendRouter = new Router();

trendRouter.get(
  "/",
  userAuthentication,
  method.getTrends
);

trendRouter.get(
  "/:trend",
  userAuthentication,
  method.trind
);

export default trendRouter;
