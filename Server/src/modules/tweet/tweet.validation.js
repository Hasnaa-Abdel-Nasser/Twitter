import Joi from "joi";

export const tweet = Joi.object({
    content: Joi.string().min(0).max(300),
    mediaCount : Joi.number().min(0).max(4)
});

