import { Router } from "express";
import { asyncHandller } from './../../utlis/asyncHandler.js';
import authen from './../../middleware/auth.js';
import { addTask, allTasks, deleteTask, getLateTask, getUserTask, updateTask, uploadAttachment } from "./controller/task.controller.js";
import { validation } from "../../middleware/validation.js";
import { addTaskSchema, deleteTaskSchema, getUserTaskSchema, updateTaskSchema } from "./controller/task.validation.js";
import uploadFile, { fileValidation } from './../../utlis/uploadFiles.js';
const router = Router()

//add task with status (toDo)(user must be logged in)
router.post('/',validation(addTaskSchema), authen,asyncHandller(addTask))

//update task (title , description , status) and assign task to other user(user must be logged in) (creator only can update task)
router.patch('/:id',validation(updateTaskSchema),  authen,asyncHandller(updateTask))

//delete task(user must be logged in) (creator only can delete task)
router.delete('/:id',validation(deleteTaskSchema), authen,asyncHandller(deleteTask))

//get all tasks with user data
router.get('/', asyncHandller(allTasks))

//get tasks of oneUser with user data (user must be logged in)
router.get('/userTask',validation(getUserTaskSchema),authen, asyncHandller(getUserTask))

//get all tasks that not done after deadline
router.get('/lateTasks',asyncHandller(getLateTask))

//add attachments to task
router.patch('/uploadAttachment/:_id',uploadFile(
    {
        customValidation: fileValidation.pdf, customPath: 'task/attachment'
    }
).single('attachment'),asyncHandller(uploadAttachment)); 





export default router