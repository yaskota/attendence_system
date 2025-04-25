import mongoose from 'mongoose'
import dotenv from 'dotenv/config'

const mongoURI=process.env.MONGOURI

const mongodb=async()=>{
    try {
        await mongoose.connect(mongoURI)
        console.log("database is connected")
    } catch (error) {
        console.log("error occur in database connection")
    }
}

export default mongodb;