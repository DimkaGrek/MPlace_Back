class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnautorizedError() {
        return new ApiError(401, 'User is not authorized');
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static NotFound(message) {
        return new ApiError(404, message);
    }

    static Conflict(message) {
        return new ApiError(409, message);
    }
}

export default ApiError;
