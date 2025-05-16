import mongoose from 'mongoose'

export const connectDB = async(req,res) => {
    try{
        mongoose.connection.on(`connected`, () =>{
            console.log('MongoDB connected successfully')
        })
        await mongoose.connect(`${process.env.MONGO_URI}`)
    } catch(error){
        console.log(error.message)
    }
}