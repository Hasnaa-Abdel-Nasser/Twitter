import * as query from "../../../database/models/comment.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const addNewComment = catchError(async (req, res, next) => {
  const {tweetId , content=''} = req.body;
  if (!content ) {
    return next(new AppError("Can't create an empty comment."));
  }
  const success = await query.addComment(req.user.id , tweetId , content);
  if(!success){
    return next(new AppError("Faild to comment at the moment." , 400));
  }
  res.status(200).json({message: "Comment successfully added."});
});
