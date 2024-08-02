import { Schema,Types,model } from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    details: {
        type: String,
        required: true
    },
    taskStatus:{
        type: String,
        enum: ['toDo', 'doing', 'done'],
        default: 'toDo',
    },
    userId:{
        type: Types.ObjectId,
        ref: 'User',
    },
    deadline:Date,
    assignTo:{
        type: Types.ObjectId,
        ref: 'User',
        require: true
    }
    
},{
    timestamps: true
})

const taskModel = model("Task", taskSchema)

export default taskModel