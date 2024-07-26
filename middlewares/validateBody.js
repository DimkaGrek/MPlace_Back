import ApiError from "../exceptions/ApiError.js";

const validateBody = (schema) => {
    const func = (req, _, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            next(new ApiError(400, error.message));
        }
        next();
    };

    return func;
};

export default validateBody;
