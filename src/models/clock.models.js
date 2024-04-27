import mongoose from "mongoose";

const clockScheck = new mongoose.Schema({
    inoutTime: {
        type: String,
        required: true
    },
    fullDate: {
        type: String,
        required: true
    },
    EmployeeName: {
        type: String,
        required: true,
        trim: true
    },
    TimeIn: {
        type: String,
        required: true,
        trim: true
    },
    TimeOut: {
        type: String,
        required: true,
        trim: true
    },
    empId: {
        type: Number,
        required: true,
        trim: true
    },
    EmpStatus: {
        type: String,
        trim: true
    }

}, { timestamps: true })

export const clockModel = new mongoose.model('clockModel', clockScheck) 