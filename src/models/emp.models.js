import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    EmpId: {
        type: Number,
        required: true,
    },
    EmpName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    Mobile:
    {
        type: Number,
        required: true,
        trim: true,
        index: true
    },
    AccoutType:
    {
        type: Boolean,
        required: true,
        index: true
    },
    EmpRole:
    {
        type: String,
        required: true,
        index: true
    },
    Status:
    {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    Password:
    {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    Confirm_Password:
    {
        type: String,
        required: true,
        trim: true,
        index: true
    }
}, { timestamps: true })

const EmpModel = new mongoose.model('EmpModel', adminSchema)

export { EmpModel }