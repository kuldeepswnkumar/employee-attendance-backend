import mongoose, { Schema } from "mongoose";

const leaveSchema = new mongoose.Schema({
    empId: {
        type: Number,
        required: true
    },
    empName: {
        type: String,
        required: true
    },
    decription: {
        type: String,
        required: true
    },
    leavefrom: {
        type: String,
        required: true
    },
    leaveto: {
        type: String,
        required: true
    },
    returndate: {
        type: String,
        required: true
    },
    leaveStatus: {
        type: String,
        required: true
    },

}, { timestamps: true })

export const leaveModel = new mongoose.model('leaveModel', leaveSchema)