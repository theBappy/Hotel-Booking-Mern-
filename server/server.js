import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'


import { connectDB } from './db/connectDB.js'
import clerkWebhooks from './controllers/clerkWebhooks.js'

connectDB()

const app = express()
app.use(cors())

// middlewares
app.use(express.json())
app.use(clerkMiddleware())

// api to listen clerk webhook
app.use('/api/clerk', clerkWebhooks)

app.get('/', (req,res)=>{
    res.send('API is working')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
    
})