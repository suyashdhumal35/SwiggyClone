import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";

const RestaurantCard = ({ restaurant, onClick }) => {
    const handleClick = useCallback(() => {
        onClick(restaurant._id);
    }, [onClick, restaurant._id]);

    const cuisines = restaurant?.cuisines?.join(", ") || "Unknown";
    const rating = restaurant?.rating || "N/A";

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            aria-label={`View details for ${restaurant?.name}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
        >
            {/* Image Section */}
            <div className="relative">
                <img
                    src={restaurant?.imageUrl}
                    alt={restaurant?.name || "Restaurant"}
                    className="w-full h-36 sm:h-44 md:h-52 lg:h-64 object-cover"
                    loading="lazy"
                />
                {restaurant?.promotion && (
                    <span className="absolute top-2 left-0 bg-orange-500 text-white px-3 py-1 text-xs sm:text-sm font-bold uppercase shadow-md">
                        ⭐ Promotion
                    </span>
                )}
            </div>

            {/* Restaurant Info */}
            <div className="p-3 sm:p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                    <h3 className="text-base sm:text-lg font-semibold truncate" title={restaurant?.name}>
                        {restaurant?.name}
                    </h3>
                    <span 
                        className="bg-green-500 text-white w-[3.8rem] text-end px-2 py-1 text-xs sm:text-sm rounded-md"
                        aria-label={`Rating: ${rating}`}
                    >
                        {rating}
                    </span>
                </div>

                {/* Description */}
                <p 
                    className="text-gray-600 text-xs sm:text-sm mt-1 truncate" 
                    title={cuisines}
                >
                    {cuisines}
                </p>

                {/* Delivery Time and Price */}
                <div className="flex justify-between items-center mt-2 sm:mt-3">
                    <p className="text-gray-500 text-xs sm:text-sm">
                        {restaurant?.deliveryTime}
                    </p>
                    <p className="text-green-500 font-bold text-xs sm:text-sm">
                        {restaurant?.costForTwoMessage}
                    </p>
                </div>
            </div>
        </div>
    );
};

RestaurantCard.propTypes = {
    restaurant: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string,
        imageUrl: PropTypes.string,
        promotion: PropTypes.bool,
        rating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        cuisines: PropTypes.arrayOf(PropTypes.string),
        deliveryTime: PropTypes.string,
        costForTwoMessage: PropTypes.string
    }).isRequired,
    onClick: PropTypes.func.isRequired
};

export default memo(RestaurantCard);