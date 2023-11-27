import * as query from '../../../database/models/follow.model.js';
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";


export const follow = catchError(async (req, res, next) => {
    try {
        const { follower_id } = req.params;
        const isFollowing = await query.existsFollow(req.user.id, follower_id);

        if (isFollowing) {
            return next(new AppError('You are already following this page', 400));
        }

        if (!await query.follow(req.user.id, follower_id) || 
            !await query.updateFollowersNumber(follower_id , 1) ||
            !await query.updateFollowingNumber(req.user.id , 1)) {
            return next(new AppError('Unable to follow the page. Please try again later', 500));
        }

        res.status(200).json({ message: 'Successfully followed the page' });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
});

export const unfollow = catchError(async(req , res , next)=>{
    try{
        const { follower_id } = req.params;
        const isFollowing = await query.existsFollow(req.user.id, follower_id);

        if (!isFollowing) {
            return next(new AppError('You are not following this page', 400));
        }

        if (!await query.unfollow(req.user.id, follower_id) || 
            !await query.updateFollowersNumber(follower_id , -1) ||
            !await query.updateFollowingNumber(req.user.id , -1)) {
            return next(new AppError('Unable to unfollow the page. Please try again later', 500));
        }

        res.status(200).json({ message: 'Successfully unfollowed the page' });
    }catch(error){
        next(new AppError(error.message, 500));
    }
});

export const allFollowers = catchError(async(req , res , next)=>{
    try{
        const followers = await query.getFollowers(req.user.id);
        res.status(200).json({message : 'success', followers: followers || [] });
    }catch(error){
        next(new AppError(error.message, 500));
    }
});

export const allFollowing = catchError(async(req , res , next)=>{
    try{
        const followings = await query.getFollowing(req.user.id);
        res.status(200).json({message:'success', followings: followings|| [] });
    }catch(error){
        next(new AppError(error.message, 500));
    }
});
