import mongoose from 'mongoose';


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.DATABASE_URL}/${"emp_attendance"}`)
        console.log(`MongoDB Connected : Host:  ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB Connection Error", error);
        process.exit(1)
    }
}
export default connectDB