import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": `missing required name field`,
    }),
    email: Joi.string().email().required().messages({
        "any.required": `missing required email field`,
    }),
    phone: Joi.string().required().messages({
        "any.required": `missing required phone field`,
    }),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().messages({
        "any.required": `missing required name field`,
    }),
    email: Joi.string().email().messages({
        "any.required": `missing required email field`,
    }),
    phone: Joi.string().messages({
        "any.required": `missing required phone field`,
    }),
});
