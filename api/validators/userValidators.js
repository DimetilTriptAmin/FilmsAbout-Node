import Joi from "joi";

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

export const changeAvatarSchema = Joi.object({
  avatar: Joi.string().required(),
});

export const getIdSchema = Joi.number().required();
