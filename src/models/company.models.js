import mongoose from 'mongoose'

const companySachema = new mongoose.Schema({
    compId: {
        type: Number,
        required: true,
        trim: true
    },
    compName: {
        type: String,
        required: true,
        trim: true
    },
    foundyear: {
        type: String,
        required: true,
        trim: true
    },
    compWebsite: {
        type: String,
        required: true,
        trim: true
    },
    compLocation: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true })

export const companyModel = new mongoose.model('companyModel', companySachema)