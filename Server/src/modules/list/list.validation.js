import Joi from "joi";

export const newList = Joi.object({
    listName : Joi.string().required().min(1).max(25),
    description : Joi.string().min(0).max(100),
    listState :  Joi.boolean(),
});

export const editList = Joi.object({
    id:  Joi.number().required(),
    listName : Joi.string().min(1).max(25),
    description : Joi.string().min(0).max(100),
    listState :  Joi.boolean(),
});

export const memberList = Joi.object({
    id: Joi.number().required(),
    memberId : Joi.number().required()
});