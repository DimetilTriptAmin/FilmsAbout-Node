import Joi from "joi";

export const getPageByIdSchema = Joi.object({
  filmId: Joi.number().required(),
  pageNumber: Joi.number().min(1).required(),
  pageSize: Joi.number().min(1).required(),
});

export const getPageAmountByIdSchema = Joi.object({
  filmId: Joi.number().required(),
  pageSize: Joi.number().min(1).required(),
});

export const postSchema = Joi.object({
  filmId: Joi.number().required(),
  text: Joi.string().required(),
});

export const deleteSchema = Joi.number().required();

export const putSchema = Joi.object({
  commentId: Joi.number().required(),
  text: Joi.string().required(),
});