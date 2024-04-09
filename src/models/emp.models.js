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
    refreshToken: {
        type: String
    }
}, { timestamps: true })


//Mongoose middlewares(pre) (save is event)
adminSchema.pre("save", async function (next) {
    //if other field update occur then passward will not be update
    if (!this.isModified("password")) return next()
    const orig_pass = this.password;
    this.password = await bcrypt.hash(orig_pass, 10)
    console.log(orig_pass);
    next()
})


adminSchema.methods.isPasswordCorrect = async function (password) {
    const match = await bcrypt.compare(password, this.password)
    return match;
}



const EmpModel = new mongoose.model('EmpModel', adminSchema)

export { EmpModel }