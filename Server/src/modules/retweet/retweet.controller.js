import * as query from "../../../database/models/retweet.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const retweet = catchError(async (req, res, next) => {
  try {
    const {id} = req.params;
    const success = await query.retweet(req.user.id , id);
    if(!success.state){
        return next(new AppError("Unable to retweet at the moment. Please try again later." , 400));
    }
    res.status(200).json({message : success.message});
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});

export const quote = catchError(async (req, res, next) => {
  try {
    const {tweetId , content='' , mediaCount=0} = req.body;
    if (!content && !mediaCount) {
        return next(new AppError("Can't create an empty tweet."));
    }
    const success = await query.quote(req.user.id , tweetId , content , mediaCount);
    if(!success){
        return next(new AppError("Unable to quote at the moment. Please try again later" , 400));
    }
    res.status(200).json({message: "Created tweet successfully"});
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});

export const getUserRetweetsAndQuotes = catchError(async (req, res, next) => {
  try {
    const allRetweets = await query.userRetweetsAndQuotes(req.user.id);
    res.status(200).json({retweets : allRetweets || []});
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});

