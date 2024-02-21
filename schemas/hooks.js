export const handleSaveError = (error, data, next) => {
    const { code, name } = error;

    // code === 11000 && name === "MongoServerError"
    //     ? (error.status = 409)
    //     : (error.status = 400);
    error.status = code === 11000 && name === "MongoServerError" ? 409 : 400;
    next();
};

export const runValidatorsAndUpdate = function (next) {
    this.options.runValidators = true;
    this.options.new = true;
    next();
};
