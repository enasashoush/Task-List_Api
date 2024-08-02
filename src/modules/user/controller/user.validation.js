import joi from 'joi'
import { generalFeilds } from '../../../utlis/general.fields.js'

export const signUpSchema = joi.object({
    fName: joi.string().min(3).max(10).required(),
    lName: joi.string().min(3).max(10).required(),
    email: generalFeilds.email,
    gender: joi.string().valid('female', 'male'),
    age: joi.number(),
    password: generalFeilds.password,
    cPassword: joi.string().valid(joi.ref('password')).required()
}).required()

export const signInSchema = joi.object({
    email: generalFeilds.email,
    password: generalFeilds.password
}).required()

export const changePassSchema = joi.object({
    newPassword: generalFeilds.password,
    oldPassword: generalFeilds.password,
    cPassword: joi.string().valid(joi.ref('newPassword')).required(),
    token: generalFeilds.token

}).required()

export const updateUserSchema = joi.object({
    newFName: joi.string().min(3).max(10),
    newLName: joi.string().min(3).max(10),
    newAge: joi.number(),
    token: generalFeilds.token


}).required()

export const deleteUserSchema = joi.object({

    token: generalFeilds.token

}).required()

export const softDeleteSchema = joi.object({

    token: generalFeilds.token

}).required()

export const forgetPassSchema = joi.object({

    email: generalFeilds.email,
    token: generalFeilds.token  

}).required()

export const resetPassSchema = joi.object({

    token: generalFeilds.token,
    password: generalFeilds.password 

}).required()

export const confirmMailSchema = joi.object({

    token: generalFeilds.token

}).required()

export const refreshTokenSchema = joi.object({

    token: generalFeilds.token

}).required()

export const uploadProfileSchema = joi.object({
    file: generalFeilds.files,
    authentication: generalFeilds.token
}).required()

