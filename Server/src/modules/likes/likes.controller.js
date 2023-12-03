import * as query from "../../../database/models/likes.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const like = catchError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await query.like(req.user.id, id);
    if (!success.state) {
      return next(new AppError("Unable to like at the moment. Please try again later.",400));
    }
    res.status(200).json({ message: success.message });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});

export const tweetLikes = catchError(async(req,res,next)=>{});

export const userLikes = catchError(async(req, res , next)=>{});