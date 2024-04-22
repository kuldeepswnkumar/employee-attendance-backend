import mongoose from "mongoose"


const EmpSchema = new mongoose.Schema({
    empid: {
        type: Number,
        // unique: true,
        required: true
    },
    fname: {
        type: String,
        required: true,
        trim: true

    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
    },
    cstatus: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        trim: true
    },
    dob: {
        type: String,
        required: true,
    },
    proof: {
        type: Number,
        required: true,
    },
    pob: {
        type: String,
        required: true,
        trim: true
    },
    fileData: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    jobtitle: {
        type: String,
        required: true,
    },
    cpemail: {
        type: String,
        required: true,
    },
    lvgroup: {
        type: String,
        required: true,
    },
    empType: {
        type: String,
        required: true,
    },
    empStatus: {
        type: String,
        required: true,
    },
    JoinDate: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },

}, { timestamps: true })

const EmployeeModels = new mongoose.model('EmployeeModels', EmpSchema)

export { EmployeeModels }