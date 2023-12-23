import * as query from "../../../database/models/likes.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const like = catchError(async (req, res, next) => {
  const { id } = req.params;
  const { success, message } = await query.like(req.user.id, id);
  if (!success) {
    return next(new AppError(message, 400));
  }
  res.status(200).json({ message });
});

export const tweetLikes = catchError(async (req, res, next) => {});

export const userLikes = catchError(async (req, res, next) => {});
