import mongoose from "mongoose";

const scheduleSchme = new mongoose.Schema({
    empId: {
        type: Number,
        // required: true
    },
    empName: {
        type: String,
        required: true
    },
    strTime: {
        type: String,
        required: true
    },
    etime: {
        type: String,
        required: true
    },
    hours: {
        type: String,
        required: true
    },
    rdays: {
        type: String,
        required: true
    },
    fdate: {
        type: String,
        required: true
    },
    tdate: {
        type: String,
        required: true
    },
    empStatus: {
        type: String,
        required: true
    },

}, { timestamps: true })

export const scheduleModel = new mongoose.model('scheduleModel', scheduleSchme)
