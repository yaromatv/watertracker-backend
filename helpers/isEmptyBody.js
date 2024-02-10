import HttpError from "./index.js";

const isEmptyBody = (req, res, next) => {
    if (!Object.keys(req.body).length) {
        return next(HttpError(400, "body must have at least one field"));
    }
    next();
};

export default isEmptyBody;
