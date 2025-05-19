import express from 'express'
import { checkAvailabilityApi, createBooking, getHotelBookings, getUsersBookings,stripePayment } from '../controllers/booking.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const bookingRouter = express.Router()

bookingRouter.post('/check-availability', checkAvailabilityApi)
bookingRouter.post('/book',protect, createBooking)
bookingRouter.get('/user',protect, getUsersBookings)
bookingRouter.get('/hotel',protect, getHotelBookings)

// payment gateway
bookingRouter.post('/stripe-payment',protect, stripePayment)

export default bookingRouter