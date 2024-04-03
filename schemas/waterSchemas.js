import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, runValidatorsAndUpdate } from "./hooks.js";

const waterSchema = new Schema(
    {
        amount: {
            type: Number,
            required: [true, "Set amount of consumed water in ml"],
        },
        date: {
            type: Date,
            required: [true, "Set the time when water been consumed"],
        },
        owner: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
    },
    { versionKey: false, timestamps: false }
);

waterSchema.post("save", handleSaveError);

waterSchema.pre("findOneAndUpdate", runValidatorsAndUpdate);
waterSchema.post("findOneAndUpdate", handleSaveError);

export const addWaterSchema = Joi.object({
    amount: Joi.number().required().messages({
        "any.required": `missing required amount field`,
    }),
    date: Joi.date().required().messages({
        "any.required": `missing required date field`,
    }),
});

const Water = model("water", waterSchema);

export default Water;
