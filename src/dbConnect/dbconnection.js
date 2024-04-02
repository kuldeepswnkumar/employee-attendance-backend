import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DB_NAME}`)
        console.log(`MongoDB Connected : Host:  ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB Connection Error", error);
        process.exit(1)
    }
}
export default connectDB