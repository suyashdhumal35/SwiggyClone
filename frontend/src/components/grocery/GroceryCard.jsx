import React, { memo } from 'react';

const GroceryCard = memo(({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
                <img 
                    src={product.thumbnail} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                    loading="lazy" // Native lazy loading for images
                />
            </div>
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">${product.price}</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {product.rating} ★
                    </span>
                </div>
                <div className="mt-3 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Brand: {product.brand}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>
            </div>
        </div>
    );
});

export default GroceryCard;