import Room from "../models/room.model.js";
import Hotel from "../models/hotel.model.js";
import {v2 as cloudinary} from 'cloudinary'

// api to create a new room for hotel
export const createRoom = async(req,res) =>{
    try{
        const {roomType , pricePerNight, amenities} = req.body
        const hotel = await Hotel.findOne({owner: req.auth.userId})
        if(!hotel){
            return res.json({success: false, message: 'No hotel found'})
        }

        // upload images to cloudinary
        const uploadImages = req.files.map(async(file) =>{
            const response = await cloudinary.uploader.upload(file.path)
            return response.secure_url

        })
        // wait for all upload to complete
        const images = await Promise.all(uploadImages)
        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: Array.isArray(amenities) ? amenities : JSON.parse(amenities),
            images,
        })
        res.json({success: true,message: 'Room created successfully'})
    }catch(error){
    res.json({success: false,message: error.message})
    }
}

// api to get all rooms 
export const getRooms = async(req,res) =>{
    try{
        const rooms = await Room.find({isAvailable:true})
        .select("roomType pricePerNight images")
        .populate({
            path: 'hotel',
            populate:{
                path: 'owner',
                select: 'image'
            }
        }).sort({createdAt: -1})
        res.json({success: true, rooms})
    }catch(error){
        res.json({success: false, message: error.message})
    }
}   


// api to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotelData) {
            return res.json({ success: false, message: "Hotel not found" });
        }
        const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate('hotel');
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};



// api to toggle availability of a room
export const toggleRoomAvailability = async(req,res) =>{
    try{
        const { roomId } = req.body
        const roomData = await Room.findById(roomId)
        if (!roomData) {
        return res.json({ success: false, message: "Room not found" });
    }
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save()
        res.json({success:true, message: 'Room availability updated'})
    }catch(error){
        res.json({success: false, message: error.message})
    }
}

