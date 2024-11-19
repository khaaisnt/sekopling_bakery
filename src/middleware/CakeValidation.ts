import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import path from "path";
import { ROOT_DIRECTORY } from "../config";
import fs from "fs";

const createSchema = Joi.object({
    cake_name: Joi.string().required(),
    cake_price: Joi.number().required().min(1),
    best_before: Joi.date().required(),
    cake_flavour: Joi.string().required(),
})   

const createValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validate = createSchema.validate(req.body);
    if (validate.error) {
        /** delete current up file */
        let fileName: string = req.file?.filename || ``;
        let pathFile = path.join(ROOT_DIRECTORY, "public", "bakery-photo", fileName);

        /** check is file extension  */
        let fileExist = fs.existsSync(pathFile);

        if (fileExist && fileName !== ``) {
            /** delete file */
            fs.unlinkSync(pathFile);
        }
            return res.status(400).json({
            message: validate.error.details.map(item => item.message).join()
        });
    }

    return next();
};

const updateSchema = Joi.object({
    cake_name: Joi.string().optional(),
    cake_price: Joi.number().optional(),
    cake_type: Joi.string().optional().valid("powder", "solid", "liquid")
});

const updateValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validate = updateSchema.validate(req.body);
    if (validate.error) {
        /** delete current up file */
        let fileName: string = req.file?.filename || ``;
        let pathFile = path.join(ROOT_DIRECTORY, "public", "bakery-photo", fileName);

        /** check is file extension  */
        let fileExist = fs.existsSync(pathFile);

        if (fileExist && fileName !== ``) {
            /** delete file */
            fs.unlinkSync(pathFile);
        }
        return res.status(400).json({
            message: validate.error.details.map(item => item.message).join()
        });
    }

    return next();
};

const deleteSchema = Joi.object({
    cake_name: Joi.string().optional(),
    cake_price: Joi.number().min(1).optional(),
    cake_type: Joi.string().optional().valid("powder", "solid", "liquid")
});

const deleteValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validate = deleteSchema.validate(req.body);
    if (validate.error) {
        /** delete current up file */
        let fileName: string = req.file?.filename || ``;
        let pathFile = path.join(ROOT_DIRECTORY, "public", "bakery-photo", fileName);

        /** check is file extension  */
        let fileExist = fs.existsSync(pathFile);

        if (fileExist && fileName !== ``) {
            /** delete file */
            fs.unlinkSync(pathFile);
        }
        return res.status(400).json({
            message: validate.error.details.map(item => item.message).join()
        });
    }

    return next();
};

export { createValidation, updateValidation, deleteValidation };