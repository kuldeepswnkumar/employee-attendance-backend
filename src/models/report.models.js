import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    empId: {
        type: Number,
        required: true
    },
    empName: {
        type: String,
        required: true
    },
    reportbox: {
        type: String,
        required: true
    },
    reportdate: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const reportModel = new mongoose.model('reportModel', reportSchema)