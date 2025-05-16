import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const HotelCard = ({ room, index }) => {
  return (
    <Link
      to={`/rooms/${room._id}`}
      onClick={() => scrollTo(0, 0)}
      className="block rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300 max-w-md mx-auto"
    >
      {/* Room Image */}
      <div className="relative">
        <img
          src={room.images[0]}
          alt="Room"
          className="w-full h-64 object-cover"
          loading="lazy"
        />
        {index % 2 === 0 && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-white text-gray-800 rounded-full shadow">
            Best Seller
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-3">
        {/* Hotel Name and Rating */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 font-playfair">
            {room.hotel.name}
          </h2>
          <div className="flex items-center text-yellow-500 gap-1">
            <img src={assets.starIconFilled} alt="Star" className="w-4 h-4" />
            <span className="text-sm font-medium">4.5</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center text-sm text-gray-600 gap-2">
          <img
            src={assets.locationIcon}
            alt="Location"
            className="w-4 h-4 opacity-80"
          />
          <span>{room.hotel.address}</span>
        </div>

        {/* Price and Book Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-gray-800">
            <span className="text-xl font-semibold">
              ${room.pricePerNight}
            </span>
            <span className="text-sm text-gray-500"> /night</span>
          </div>
          <button className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 cursor-pointer transition-all font-medium shadow-sm">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
