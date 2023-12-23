import * as query from "../../../database/models/bookmark.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const bookmark = catchError(async (req, res, next) => {
  const { id } = req.params;
  const {success , message} = await query.bookmark(req.user.id, id);
  if (!success) {
    return next(new AppError(message, 400));
  }
  res.status(200).json({ message});
});

export const userBookmarks = catchError(async (req, res, next) => {});
