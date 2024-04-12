import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


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

adminSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            empId: this.empId,
            empName: this.empName,
            email: this.email,
            mobile: this.mobile,
            accType: this.accType,
            empRole: this.empRole,
            status: this.status
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

adminSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '1d'
        }
    )
}



const EmpModel = new mongoose.model('EmpModel', adminSchema)

export { EmpModel }