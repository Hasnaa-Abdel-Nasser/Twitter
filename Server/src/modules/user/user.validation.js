import Joi from "joi";

export const registerData = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().required().email(),
    birthDate: Joi.date()
              .max('now')
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

