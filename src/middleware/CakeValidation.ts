import { Request, Response, NextFunction} from "express"
import Joi from "joi"

const createScheme = Joi.object({
    cake_name: Joi.string().required(),
    cake_price: Joi.number().min(1).required(),
    best_before: Joi.date().required(),
    cake_flavour: Joi.string().required(),
})



