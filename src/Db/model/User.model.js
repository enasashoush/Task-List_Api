import { Schema, Types, model } from "mongoose";

const userSchema = new Schema({
    fName: {
        type: String,
        required: true

    },
    lName: String,
    email: {
        type: String,
        unique: true,
        required: true

    },
    password: {
        type: String,
        required: true

    },
    age: Number,
    gender: {
        type: String,
        enum: ['female', 'male'],
        default: 'male'

    },
    phone: String,
    profilPic: {
        type: String,
    },
    coverPic: [{
        type: String

    }],

    deleted: {
        type: Boolean,
        default: false
    },
    task:  [{
        type: Types.ObjectId,
        ref: 'Task'
    } ],
    confirmEmail: {
        type: Boolean,
        default: false
    }


}, {
    timestamps: true
})

const userModel = model("User", userSchema)


export default userModel