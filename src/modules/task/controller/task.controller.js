import taskModel from "../../../Db/model/Task.model.js";
import userModel from "../../../Db/model/User.model.js";



//add task with status (toDo)(user must be logged in)    
export const addTask = async (req, res, next) => {
    const { title, assignTo } = req.body
    const titleExists = await taskModel.findOne({ title })
    if (titleExists) {
        return next(new Error('Task already exists', { cause: 400 }))
    }

    const assign = await userModel.findOne({_id:assignTo})
    if (!assign) {
        return next(new Error('user does not exist', { cause: 400 }))

    }


    const task = new taskModel({ title: req.body.title, details: req.body.details, taskStatus: req.body.taskStatus, deadline: req.body.deadline,assignTo })
    await task.save()



    return res.json({ message: 'task added', task })


}

//update task (title , description , status) and assign task to other user(user must be logged in) (creator only can update task)
export const updateTask = async (req, res, next) => {
    const { title, details, taskStatus, assignTo } = req.body;
    const { id } = req.params;

    const assign = await userModel.findOne({ _id:assignTo})
    if (!assign) {
        return next(new Error('user does not exist', { cause: 400 }))   
    }
    
    const task = await taskModel.findOneAndUpdate({ _id: id }, { title, details, taskStatus, assignTo }, { new: true });
    if (!task) {
        return next(new Error('Task not found or unauthorized', { cause: 404 }));
    }


    return res.json({ message: 'Task updated', task });
}

//delete task(user must be logged in) (creator only can delete task)
export const deleteTask = async (req, res, next) => {
    const { id } = req.params;
    const task = await taskModel.findByIdAndDelete(id)
    if (task == null) {
        return next(new Error('Task not found ', { cause: 404 }));

    }

    return res.json({ message: 'Task deleted', task });

}

//get all tasks with user data
export const allTasks = async (req, res, next) => {

    const tasks = await taskModel.find().populate('userId', 'fName email ');

    return res.json({ message: ' all tasks', tasks })
}

//get tasks of oneUser with user data (user must be logged in)
export const getUserTask = async (req, res, next) => {


    const user = await taskModel.find({ assignTo: req.user._id }).populate('assignTo', 'fName email age');

    return res.json({ message: 'done', user })

};

//get all tasks that not done after deadline
export const getLateTask = async (req, res, next) => {
    const currentDate = new Date();

    const tasks = await taskModel.find({ deadline: { $lt: currentDate }, taskStatus: { $ne: 'done' } });


    return res.json({ message: 'done', tasks });
}

// upload attachment to task
export const uploadAttachment = async (req, res, next) => {
    const {_id} =  req.params
    const task = await taskModel.findByIdAndUpdate({ _id},{ details: req.file.finalDest}, {new: true});
    return res.json({ message: 'done', task })

}



