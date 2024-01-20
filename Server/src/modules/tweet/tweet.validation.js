import Joi from "joi";

export const tweet = Joi.object({
    content: Joi.string().min(0).max(280),
    canRetweet: Joi.string().valid('everyone', 'account_follow', 'verified_accounts', 'only_mention').default('everyone'),
});

export const editTweet = Joi.object({
    content: Joi.string().min(0).max(280),
    canRetweet: Joi.string().valid('everyone', 'account_follow', 'verified_accounts', 'only_mention').default('everyone'),
})

