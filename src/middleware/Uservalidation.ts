import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const createUser = Joi.object({
    user_name: Joi.string().required(),
    user_email: Joi.string().email().required(),
    user_password: Joi.string().min(8).required(),
    user_role: Joi.string().valid("ADMIN", "USER").required(),
})

const createValidation = async (
    req: Request, 
    res: Response, 
    next: NextFunction) => {
        const validate = createUser.validate(req.body);
        if (validate.error) {
            return res.status(400).json({
                message: validate
                .error
                .details
                .map((error) => error.message)
                .join()
            })
        }
    return next();
}



export { createValidation };