import mongoose from 'mongoose'

// Connect MongoDB
export const connectDb = async () => {

    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/mydb")
        console.log("MongoDB connected")

    } catch (error) {
        console.log(err)

    }

}
