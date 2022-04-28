import Joi from "joi";

export const getIdSchema = Joi.number().required();
export const getIdByTitleSchema = Joi.string().required();
