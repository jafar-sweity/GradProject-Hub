import Joi from "joi";
import { NextFunction, Request, Response } from "express";

const validateRequest = function (schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction): any => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ errors: error.details.map((error) => error.message) });
    }
    next();
  };
};

export default validateRequest;
