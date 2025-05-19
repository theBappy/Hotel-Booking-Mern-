import Booking from "../models/bookings.model.js";
import Room from "../models/room.model.js";
import Hotel from "../models/hotel.model.js";
import transporter from "../nodemailer/nodemailer.js";

// Function to check availability of a room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate },
        });
        return bookings.length === 0;
    } catch (error) {
        console.error("Availability check error:", error.message);
        return false; // default to not available if error occurs
    }
};

// POST /api/bookings/check-availability
export const checkAvailabilityApi = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/bookings/book
export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.auth?.userId || req.user?._id;

        // Check availability before booking
        const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
        if (!isAvailable) {
            return res.json({ success: false, message: 'Room is not available for the selected dates' });
        }

        const roomData = await Room.findById(room).populate('hotel');
        if (!roomData || !roomData.hotel) {
            return res.json({ success: false, message: 'Invalid room or hotel data' });
        }

        // Calculate total price based on number of nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const totalPrice = roomData.pricePerNight * nights;

        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: req.user.email,
            subject: 'Hotel Booking Details',
            html: `
                <h2>Your Bookings Details</h2>
                <p>Dear ${req.user.username},</p>
                <p>Thank you for your booking! Here are you bookings details: </p>
                <ul>
                    <li><strong>Booking ID:</strong> ${booking._id}</li>
                    <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                    <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                    <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
                    <li><strong>Booking Amount:</strong>${process.env.CURRENCY || '$'}${booking.totalPrice} /night</li>
                </ul>
                <p>We look forward to welcome you!</p>
                <p>If you need to make any changes, feel free to contact us.</p>
            `
        }
        await transporter.sendMail(mailOptions)

        res.json({ success: true, message: 'Booking created successfully', booking });
    } catch (error) {
        console.error("Booking creation error:", error);
        res.json({ success: false, message: 'Failed to create booking' });
    }
};

// GET /api/bookings/user
export const getUsersBookings = async (req, res) => {
    try {
        const user = req.auth?.userId || req.user?._id;
        const bookings = await Booking.find({ user })
            .populate('room hotel')
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/bookings/hotel
export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotel) {
            return res.json({ success: false, message: 'No hotel found' });
        }

        const bookings = await Booking.find({ hotel: hotel._id })
            .populate('room hotel user')
            .sort({ createdAt: -1 });

        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

        res.json({
            success: true,
            dashboardData: { totalBookings, totalRevenue, bookings }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
