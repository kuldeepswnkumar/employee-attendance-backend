import express from 'express'
import dotenv from 'dotenv'
import connectDB from './dbConnect/dbconnection.js'

const app = express()

dotenv.config({
    path: './.env'
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8001, () => {
            console.log(`Server running of Port ${process.env.PORT}`);
        })
    })
    .catch((error) => console.log("Database Connection Failed!", error))
