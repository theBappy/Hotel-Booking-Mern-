import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import { clerkMiddleware } from '@clerk/express';

import { connectDB } from './db/connectDB.js';
import clerkWebhooks from './controllers/clerkWebhooks.js';

// static image files
import connectCloudinary from './cdn/cloudinary.js';

// api end-points
import userRouter from './routes/user.route.js';
import hotelRouter from './routes/hotel.route.js';
import roomRouter from './routes/room.route.js';
import bookingRouter from './routes/booking.route.js';
import { stripeWebhooks } from './stripe/stripeWebhook.js';

connectDB();
connectCloudinary();

const app = express();
app.use(cors()); // enable cross-origin resource sharing

// api to listen to stripe webhooks
app.post('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks)



// 👇 Clerk webhook must be processed BEFORE JSON middleware
app.post('/api/clerk', bodyParser.raw({ type: 'application/json' }), clerkWebhooks);

// Global middleware after Clerk raw parser
app.use(express.json());
app.use(clerkMiddleware());

// Test route
app.get('/', (req, res) => {
  res.send('API is working');
});
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
