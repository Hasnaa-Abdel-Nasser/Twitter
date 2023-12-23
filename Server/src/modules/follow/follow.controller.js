import * as query from "../../../database/models/follow.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const follow = catchError(async (req, res, next) => {
  const { follower_id } = req.params;
  const isFollowing = await query.existsFollow(req.user.id, follower_id);
  const {success , message} = isFollowing
    ? await query.unfollow(req.user.id , follower_id)
    : await query.follow(req.user.id , follower_id);
  if(!success){
    return next(new AppError(message , 400));
  }
  res.status(200).json({ message });
});

export const allFollowers = catchError(async (req, res, next) => {
  const followers = await query.getFollowers(req.user.id);
  res.status(200).json({followers: followers || [] });
});

export const allFollowing = catchError(async (req, res, next) => {
  const followings = await query.getFollowing(req.user.id);
  res.status(200).json({followings: followings || [] });
});
