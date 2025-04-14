import React from 'react';

const GroceryCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            {/* Image Placeholder */}
            <div className="h-48 bg-gray-200"></div>

            {/* Content Placeholder */}
            <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>

                {/* Price and Rating */}
                <div className="flex justify-between items-center mt-4">
                    <div className="h-5 w-16 bg-gray-300 rounded"></div>
                    <div className="h-5 w-10 bg-gray-300 rounded"></div>
                </div>

                {/* Brand and Stock */}
                <div className="flex justify-between items-center mt-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
};

export default GroceryCardSkeleton;
