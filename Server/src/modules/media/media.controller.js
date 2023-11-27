import * as query from '../../../database/models/media.model.js';
import * as tweetQuery from '../../../database/models/tweet.model.js';
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";
import {uploadToCloudinary , removeFromCloudinary} from "../../utils/files.uploads.js"

export const uploadTweetMedia = catchError(async(req , res , next)=>{
    try{
        const {media} = req.files;
        const {tweetId} = req.body;
        // Check if the tweet exists
        const tweet = await tweetQuery.getTweet(tweetId);

        if(!tweet.length) return next(new AppError('Tweet not found' , 400));
        // Check the number of media files
        if(!media || tweet[0].media_count >= 4 || media.length > 4){
            return next(new AppError('At least 1 image is required, and maximum images allowed are 4.', 400));
        }
        // Upload each media file to Cloudinary
        for (const image of media) {
            const { url, publicId } = await uploadToCloudinary(image.path, 'tweets');
            console.log(publicId);
            await query.uploadMedia(req.user.id, tweetId, url, publicId);
        }
        // Update the media count for the tweet
        await query.updateMediaCount(tweetId, media.length);
        res.status(200).json({message : 'Media upload successful'});
    }catch(error){
        next(new AppError(error.message , 500));
    }
});

export const deleteTweetMedia = catchError(async(req , res , next)=>{
    try{
        const {id} = req.params;
        // Get media details
        const [media] = await query.getMedia(id);
        if(media[0].user_id != req.user.id){
            return next(new AppError("You don't have permission to delete this media.", 400));
        }
        await removeFromCloudinary(media[0].public_id);        // Remove media from Cloudinary
        await query.deleteMedia(id);          // Delete media entry from the database
        await query.updateMediaCount(media[0].tweet_id , -1);         // Update the media count for the associated tweet
        res.status(200).json({ message: 'Media deletion successful.' });
    }catch(error){
        next(new AppError(error.message , 500));
    }
});
