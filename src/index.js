import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import connectDB from './dbConnect/dbconnection.js'
import cors from 'cors'
import router from './routes/emp.route.js'
import cookieParser from 'cookie-parser'



const app = express()

dotenv.config({
    path: './.env'
})

app.use(cors({
    origin: process.env.CORS,
    credentials: true
}))

app.use(express.json({ limit: '16kb' }))
//When getting data from url
//extended is use for you can take nested object
app.use(urlencoded({ extended: true, limit: '16kb' }))
//It is use for store some files and img
app.use(express.static("public"))
app.use(cookieParser())

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running of Port ${process.env.PORT}`);
        })
    })
    .catch((error) => console.log("Database Connection Failed!", error))


app.use('/api/user', router)