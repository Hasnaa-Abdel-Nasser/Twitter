import Joi from "joi";

export const tweet = Joi.object({
    content: Joi.string().min(0).max(300),
});

