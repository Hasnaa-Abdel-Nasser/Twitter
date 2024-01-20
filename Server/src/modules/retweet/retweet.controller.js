import * as query from "../../../database/models/retweet.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const retweet = catchError(async (req, res, next) => {
  const { id } = req.params;
  const { success, message } = await query.retweet(req.user.id, id);
  if (!success) {
    return next(new AppError(message, 400));
  }
  res.status(200).json({ message });
});

export const quote = catchError(async (req, res, next) => {
  const { tweetId, content , canRetweet ='everyone'} = req.body;
  if (!content) {
    return next(new AppError("Can't create an empty tweet."));
  }
  const {success , message} = await query.quote(req.user.id, tweetId, content , canRetweet);
  if (!success) {
    return next(new AppError(message, 400));
  }
  res.status(200).json({ message });
});

export const getUserRetweetsAndQuotes = catchError(async (req, res, next) => {});
