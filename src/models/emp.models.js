import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const adminSchema = new mongoose.Schema({
    empId: {
        type: Number,
        required: true,
    },
    empName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    mobile:
    {
        type: Number,
        required: true,
        trim: true,
    },
    accType:
    {
        type: String,
        required: true
    },
    empRole:
    {
        type: String,
        required: true,
    },
    status:
    {
        type: String

    },
    password:
    {
        type: String,
        required: true,
        trim: true,
    },
    cfmpassword:
    {
        type: String,
        required: true,
        trim: true,
    },
    refresherToken:
    {
        type: String,
    }
}, { timestamps: true })

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    const orig_pass = this.password;
    console.log(orig_pass);
})

const EmpModel = new mongoose.model('EmpModel', adminSchema)

export { EmpModel }