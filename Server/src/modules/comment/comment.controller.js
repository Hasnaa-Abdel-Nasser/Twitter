import * as query from "../../../database/models/comment.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const addNewComment = catchError(async (req, res, next) => {
  try {
    const {tweetId , content='' , mediaCount=0} = req.body;
    if (!content && !mediaCount) {
      return next(new AppError("Can't create an empty comment."));
    }
    const success = await query.addComment(req.user.id , tweetId , content , mediaCount);
    if(!success){
        return next(new AppError("Unable to comment at the moment. Please try again later" , 400));
    }
    res.status(200).json({message: "Created comment successfully"});
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});
