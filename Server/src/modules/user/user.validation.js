import Joi from "joi";

export const registerData = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().required().email(),
    birthDate: Joi.date()
              .min(new Date(new Date().setFullYear(new Date().getFullYear() - 15)))
              .message('Birth date must be at least 15 years ago.'),
    password: Joi.string()
              .min(8).max(20)
              .required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
              .message('Password must be between 8 and 20 characters and include at least one lowercase letter, one uppercase letter, one digit, and one special character.'),
    rePassword: Joi.ref('password')
});

export const loginData = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).max(20).required()
});

export const verifyCode = Joi.object({
    email: Joi.string().required().email(),
    code : Joi.string().required().min(6).message('Code must be 6 numbers'),
});

export const profileData = Joi.object({
    name : Joi.string().min(3).max(50),
    bio : Joi.string().min(0).max(160),
    location : Joi.string().min(0).max(30),
    website : Joi.string().min(0).max(100),
    birthDate : Joi.date()
                .min(new Date(new Date().setFullYear(new Date().getFullYear() - 15)))
                .message('Birth date must be at least 15 years ago.'),
});