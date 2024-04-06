import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, runValidatorsAndUpdate } from "./hooks.js";

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: emailRegex,
        },
        password: {
            type: String,
            minlength: 6,
            required: [true, "Set password for user"],
        },
        token: String,
        avatarURL: {
            type: String,
            required: true,
        },
        waterRate: {
            type: Number,
            default: 2000,
            max: [15000, "Max water rate value is 15000"],
            min: [0, "Min water rate value is 0"],
        },
        name: {
            type: String,
        },
        gender: {
            type: String,
        },
    },
    { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", runValidatorsAndUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required().messages({
        "any.required": `missing required email field`,
    }),
    password: Joi.string().min(6).required().messages({
        "any.required": `missing required password field`,
    }),
});

export const userUpdateSchema = Joi.object({
    gender: Joi.string().valid("Man", "Woman").optional(),
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    avatar: Joi.object({
        filename: Joi.string().required(),
        mimetype: Joi.string().required(),
        buffer: Joi.binary().required(),
    }).optional(),
    currentPass: Joi.string().optional(),
    newPass: Joi.string().min(6).when("currentPass", {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    repNewPass: Joi.string()
        .min(6)
        .when("currentPass", {
            is: Joi.exist(),
            then: Joi.required().valid(Joi.ref("/newPass")),
            otherwise: Joi.optional(),
        }),
});

const User = model("user", userSchema);

export default User;
