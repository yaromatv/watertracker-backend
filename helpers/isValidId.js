import { isValidObjectId } from "mongoose";
import HttpError from "./index.js";

const isValidId = (req, res, next) => {
    const { waterId } = req.params;
    if (!isValidObjectId(waterId)) {
        return next(HttpError(400, `${waterId} is not valid id`));
    }
    next();
};

export default isValidId;
