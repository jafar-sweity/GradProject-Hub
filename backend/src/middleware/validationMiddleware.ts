import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Schema for User Registration
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

// Validation Middleware for Registration
export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = registrationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true, 
  });
  if (error) {
    res.status(400).json({ errors: error.details.map((err) => err.message) });
    return;
  }
  next();
};

// Schema for User Login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
});

// Validation Middleware for Login
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = loginSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true, // Removes any extraneous fields
  });
  if (error) {
    res.status(400).json({ errors: error.details.map((err) => err.message) });
    return;
  }
  next(); // Call next() if validation passes
};
