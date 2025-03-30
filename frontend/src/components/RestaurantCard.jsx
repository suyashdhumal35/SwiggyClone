import React from "react";

const RestaurantCard = ({ restaurant, onClick }) => {
    return (
        <div
            onClick={() => onClick(restaurant._id)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        >
            {/* Image Section */}
            <div className="relative">
                <img
                    src={restaurant?.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-36 sm:h-44 md:h-52 lg:h-64 object-cover"
                />
                {restaurant.promotion && (
                    <span className="absolute top-2 left-0 bg-orange-500 text-white px-3 py-1 text-xs sm:text-sm font-bold uppercase shadow-md">
                        ⭐ Promotion
                    </span>
                )}
            </div>

            {/* Restaurant Info */}
            <div className="p-3 sm:p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                    <h2 className="text-base sm:text-lg font-semibold">{restaurant?.name}</h2>
                    <span className="bg-green-500 text-white w-[3.8rem] text-end px-2 py-1 text-xs sm:text-sm rounded-md">
                        {restaurant?.rating || "N/A"}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    {restaurant?.cuisines ? restaurant.cuisines.join(", ") : "Unknown"}
                </p>

                {/* Delivery Time and Price */}
                <div className="flex justify-between items-center mt-2 sm:mt-3">
                    <p className="text-gray-500 text-xs sm:text-sm">{restaurant?.deliveryTime}</p>
                    <p className="text-green-500 font-bold text-xs sm:text-sm">
                        {restaurant?.costForTwoMessage}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;
