import { Types } from "mongoose";

export const validation = (schema) => {
    return (req, res, next) => {
        try {
            let methods
            if (req.headers.auth) {
                methods = { ...req.body, ...req.query, ...req.params, token: req.headers.auth }

            } else {
                methods = { ...req.body, ...req.query, ...req.params }

            }
            if(req.file){
                methods ={...methods,file:req.file}

            }
            if(req.files){
                methods ={...methods,file:req.files}

            }
            {
                {
                    file:{

                    }
                }
            }
            const validationResult = schema.validate(methods, { abortEarly: false });




            if (validationResult?.error) {

                req.validationResult = validationResult.error.details;
                return next(new Error('validation error', { cause: 403 }));
            }

            return next()

        } catch (error) {

            return res.status(500).json({
                message: error.message, stack: error.stack

            });

        }

    }
}

export const idValidation = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message('invalid id');
}

