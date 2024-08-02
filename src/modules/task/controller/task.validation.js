import joi from 'joi'
import { generalFeilds } from './../../../utlis/general.fields.js';

export const addTaskSchema = joi.object({
    title: generalFeilds.title,
    details: generalFeilds.details,
    taskStatus: generalFeilds.taskStatus,
    token: generalFeilds.token,
    deadline: joi.date(),
    assignTo:generalFeilds._id,
}).required()

export const updateTaskSchema = joi.object({

    title: generalFeilds.title,
    details: generalFeilds.details,
    taskStatus: generalFeilds.taskStatus,
    token: generalFeilds.token,
    assignTo:generalFeilds._id,
    id: generalFeilds._id
})

export const deleteTaskSchema = joi.object({
    token: generalFeilds.token,
    id: generalFeilds._id

})

export const getUserTaskSchema = joi.object({

    token: generalFeilds.token,

})