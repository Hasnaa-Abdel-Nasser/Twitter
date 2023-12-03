import * as query from "../../../database/models/bookmark.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const bookmark = catchError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await query.bookmark(req.user.id, id);
    if (!success.state) {
      return next(new AppError("Please try again later.",400));
    }
    res.status(200).json({ message: success.message });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});

export const userBookmarks = catchError(async(req, res , next)=>{});