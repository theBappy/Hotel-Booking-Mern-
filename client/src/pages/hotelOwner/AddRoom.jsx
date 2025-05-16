import React, { useState } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";

const AddRoom = () => {
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [input, setInput] = useState({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      "Free Wifi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Mountain View": false,
      "Poll Access": false,
    },
  });
  return (
    <form>
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sit amet vehicula arcu, a mattis justo. Aenean facilisis in turpis quis lacinia. Sed a mollis odio, id pretium quam. Nullam scelerisque sem nis"
      />
      {/* upload area for images */}
      <p className="text-gray-800 mt-10">Images</p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            <img
              className="max-h-13 cursor-pointer opacity-80"
              src={
                images[key]
                  ? URL.createObjectURL(images[key])
                  : assets.uploadArea
              }
              alt="image"
            />
            <input
              onChange={(e) =>
                setImages({ ...images, [key]: e.target.files[0] })
              }
              type="file"
              accept="image/*"
              id={`roomImage${key}`}
              hidden
            />
          </label>
        ))}
      </div>

      {/* select box to choose the room type and price */}
      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-4">
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Room Type</p>
          <select
            onChange={(e) => setInput({ ...input, roomType: e.target.value })}
            value={input.roomType}
            className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full"
          >
            <option value="" className="">
              Select Room Type
            </option>
            <option value="Single Bed" className="">
              Single Bed
            </option>
            <option value="Double Bed" className="">
              Double Bed
            </option>
            <option value="Luxury Room" className="">
              Luxury Room
            </option>
            <option value="Family Suite" className="">
              Family Suite
            </option>
          </select>
        </div>
        <div className="">
          <p className="mt-4 text-gray-800">
            Price <span className="text-xs">/night</span>{" "}
          </p>
          <input
            type="number"
            placeholder="0"
            className="border border-gray-300 mt-1 rounded p-2 w-24"
            value={input.pricePerNight}
            onChange={(e) =>
              setInput({ ...input, pricePerNight: e.target.value })
            }
          />
        </div>
      </div>
      {/* amenities */}
      <p className="text-gray-800 mt-4">Amenities</p>
      <div className="flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm">
        {Object.keys(input.amenities).map((amenity, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`amenities${index + 1}`}
              checked={input.amenities[amenity]}
              onChange={() =>
                setInput({
                  ...input,
                  amenities: {
                    ...input.amenities,
                    [amenity]: !input.amenities[amenity],
                  },
                })
              }
            />
            <label htmlFor={`amenities${index + 1}`}> {amenity}</label>
          </div>
        ))}
      </div>
      <button className="bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer">
        Add Room
      </button>
    </form>
  );
};

export default AddRoom;
