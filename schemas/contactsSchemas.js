import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, runValidatorsAndUpdate } from "./hooks.js";

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Set name for contact"],
        },
        email: {
            type: String,
            required: [true, "Set email for contact"],
        },
        phone: {
            type: String,
            required: [true, "Set phone for contact"],
        },
        favorite: {
            type: Boolean,
            default: false,
        },
        owner: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
    },
    { versionKey: false }
);

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", runValidatorsAndUpdate);
contactSchema.post("findOneAndUpdate", handleSaveError);

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
    favorite: Joi.boolean(),
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

export const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required().messages({
        "any.required": `missing required favorite field`,
    }),
});

const Contact = model("contact", contactSchema);

export default Contact;
