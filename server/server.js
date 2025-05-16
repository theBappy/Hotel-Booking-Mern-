import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import { clerkMiddleware } from '@clerk/express';

import { connectDB } from './db/connectDB.js';
import clerkWebhooks from './controllers/clerkWebhooks.js';

connectDB();

const app = express();
app.use(cors());

// 👇 Clerk webhook must be processed BEFORE JSON middleware
app.post('/api/clerk', bodyParser.raw({ type: 'application/json' }), clerkWebhooks);

// Global middleware after Clerk raw parser
app.use(express.json());
app.use(clerkMiddleware());

// Test route
app.get('/', (req, res) => {
  res.send('API is working');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
