import Joi from "joi";

export const waterRateSchema = Joi.object({
  waterRate: Joi.number().required(),
});
