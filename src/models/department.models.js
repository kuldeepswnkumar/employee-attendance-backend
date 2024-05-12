import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
    departId: {
        type: Number,
        required: true
    },
    deptName: {
        type: String,
        required: true
    },
    jobRole: {
        type: String,
        required: true
    },
    deprtEmail: {
        type: String,
        required: true
    },
    deprtStatus: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const departmentModel = new mongoose.model('departmentModel', DepartmentSchema)