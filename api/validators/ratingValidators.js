import Joi from "joi";

export const postSchema = Joi.object({
  filmId: Joi.number().required(),
  rate: Joi.number().min(1).max(5).required(),
});

export const getIdSchema = Joi.number().required();
