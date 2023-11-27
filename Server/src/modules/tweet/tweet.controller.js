import * as query from "../../../database/models/tweet.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const createTweet = catchError(async (req, res, next) => {
  try {
    const { content = "", mediaCount = 0 } = req.body;
    if (!content && !mediaCount) {
      return next(new AppError("Can't create an empty tweet."));
    }
    const success = await query.createTweet(req.user.id, content, mediaCount);
    if (!success) {
      return next(new AppError("Unable to create the tweet. Please try again later.", 400));
    }
    res.status(200).json({ message: "Created tweet successfully" });
  } catch (error) {
    next(new AppError(error.message , 500));
  }
});

export const editTweetContent = catchError(async (req, res, next) => {
    try{
        const {tweetId , content} = req.body;
        const foundTweet = await query.getTweet(tweetId);
        if(!foundTweet.length){
            return next(new AppError("Not found tweet" , 400));
        }
        const success = await query.editTweet(req.user.id , tweetId , content);
        if(!success){
          return next(new AppError("Unable to edit the tweet. Please try again later." , 400));
        }
        res.status(200).json({message : "Edit tweet successfully"});
    }catch(error){
      next(new AppError(error.message , 500));
    }
});

export const getUserTweets = catchError(async (req , res , next)=>{
  try{
    const tweets = await query.getAllTweetsAndQuotes(req.user.id);
    res.status(200).json({tweets: tweets || []});
  }catch(error){
    next(new AppError(error.message , 500));
  }
});

export const deleteTweet = catchError(async (req , res , next)=>{
  try{
    const {id} = req.params;
    const success = await query.deleteTweet(req.user.id , id);
    if(!success){
      return next(new AppError("Unable to edit the tweet. Please try again later." , 400));
    }
    res.status(200).json({message : "Tweet deleted successfully"});
  }catch(error){
    next(new AppError(error.message , 500));
  }
});