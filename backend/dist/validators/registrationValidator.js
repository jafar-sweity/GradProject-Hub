import Joi from "joi";
const registrationSchema = Joi.object({
    name: Joi.string().max(255).required().messages({
        "string.empty": "Name is required",
        "string.max": "Name must be at most 255 characters",
    }),
    email: Joi.string().email().max(255).required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
        "string.max": "Email must be at most 255 characters",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters",
    }),
    role: Joi.string()
        .valid("student", "supervisor", "admin")
        .required()
        .messages({
        "string.empty": "Role is required",
        "any.only": "Role must be either student, supervisor, or admin",
    }),
});
export default registrationSchema;
//# sourceMappingURL=registrationValidator.js.map