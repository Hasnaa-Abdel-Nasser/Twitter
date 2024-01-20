import * as query from "../../../database/models/tweet.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const createTweet = catchError(async (req, res, next) => {
  const { content , canRetweet = 'everyone'} = req.body;

  if (content.length === 0 && !req.files.media) {
    return next(new AppError("Can't create an empty tweet." , 400));
  }
  const success = await query.createTweet(req.user.id, content , canRetweet , req.files.media);

  if (!success) {
    return next(new AppError("Failed to create the tweet. Please try again later.", 400));
  }

  res.status(200).json({ message: "Created tweet successfully" });
});

export const editTweet = catchError(async (req, res, next) => {
  const { tweetId, content , canRetweet = 'everyone'} = req.body;
  const foundTweet = await query.getTweet(tweetId);

  if (!foundTweet.length) {
    return next(new AppError("Not found tweet", 400));
  }

  const success = await query.editTweet(req.user.id, tweetId, content , canRetweet);

  if (!success) {
    return next(new AppError("Failed to edit the tweet. Please try again later.", 400));
  }

  res.status(200).json({ message: "Edited tweet successfully" });
});

export const editTweetViews = catchError(async (re1, res, next) => {
  const { id } = req.params;
  const success = await query.editViewsNumber(id);

  if (!success) {
    return next(new AppError("Please try again later.", 400));
  }

  res.status(200).json({ message: "Added to views successully" });
});

export const getUserTweets = catchError(async (req, res, next) => {
  const tweets = await query.getAllTweetsAndQuotes(req.user.id);
  res.status(200).json({ tweets: tweets || [] });
});

export const deleteTweet = catchError(async (req, res, next) => {
  const { id } = req.params;
  const success = await query.deleteTweet(req.user.id, id);

  if (!success) {
    return next(new AppError("Failed to delete the tweet. Please try again later.", 400));
  }
  
  res.status(200).json({ message: "Tweet deleted successfully" });
});
