import Joi from "joi";

export const userSingUpSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "any.required": "email is required",
        "string.base": "The email must be a text string.",
        "string.email": "email must be in email format (like jonh@mail.com)",
    }),
    password: Joi.string()
        .pattern(
            new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:"\\\\|,.<>\\/?]*$')
        ) // Дозволяє латинські літери, цифри та спецсимволи, крім пробілів
        .min(8)
        .max(128)
        .required()
        .messages({
            "any.required": "password is required",
            "string.empty": "The password cannot be empty.",
            "string.base": "The password must be a text string.",
            "string.min":
                "The password must contain at least {#limit} characters.",
            "string.max":
                "The password must contain no more than {#limit} characters.",
            "string.pattern.base":
                "The password can only contain Latin letters, numbers, and special characters, and must not include spaces.",
        }),
    repassword: Joi.string(),
});

export const userSubscription = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").required(),
});

export const verifyEmailSchema = Joi.object({
    email: Joi.string().email().required(),
});
