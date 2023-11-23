import * as query from '../../../database/models/tweet.model.js';
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const createTweet = catchError(async(req , res , next)=>{
    try{
        const {content='' , mediaCount=0} = req.body;
        if (!content && !mediaCount) {
            return next(new AppError('Can\'t create an empty tweet.'));
        }
        const success = await query.createTweet(req.user.id, content, mediaCount);
        if (success) {
            res.status(200).json({ message: 'Created tweet successfully' });
        } else {
            return next(new AppError('Unable to create the tweet. Please try again later.' , 400));
        }
    }catch(error){
        next(new AppError({ message: error.message }, 500));
    }
})


