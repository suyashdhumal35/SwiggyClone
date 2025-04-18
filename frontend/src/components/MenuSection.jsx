import React, { useState, useCallback, memo } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { addItem } from "../redux/cartSlice";

const MenuSection = ({ title, items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const toggleSection = useCallback(() => setIsOpen(prev => !prev), []);
    
    const handleAddToCart = useCallback((item) => {
        dispatch(addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            description: item.description,
            restaurantId: item.restaurantId,
            quantity: 1, // Added quantity field
            customization: "" // Added for future customization options
        }));
    }, [dispatch]);

    const handleKeyDown = useCallback((e, item) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAddToCart(item);
        }
    }, [handleAddToCart]);

    return (
        <div className="mt-3 border border-gray-200 rounded-lg shadow-md overflow-hidden transition-all duration-200">
            <div
                className="flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 p-4 transition-colors duration-200"
                onClick={toggleSection}
                role="button"
                aria-expanded={isOpen}
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSection()}
            >
                <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                    <span className="bg-gray-200 text-gray-600 px-2 py-1 text-xs rounded-full">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                </div>
                <span 
                    className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                >
                    🔽
                </span>
            </div>

            {isOpen && (
                <div className="divide-y divide-gray-100 max-h-[80vh] overflow-y-auto">
                    {items.map((item) => (
                        <div 
                            key={`${item.id}-${item.name}`} 
                            className="flex p-4 hover:bg-gray-50 transition-colors duration-150"
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e, item)}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <h3 
                                        className="text-md font-semibold text-gray-800 truncate"
                                        title={item.name}
                                    >
                                        {item.name}
                                    </h3>
                                    <span className="text-md font-bold text-gray-900 whitespace-nowrap ml-2">
                                        ₹{item.price.toFixed(2)}
                                    </span>
                                </div>
                                
                                {item.description && (
                                    <p 
                                        className="text-sm text-gray-500 mt-1 line-clamp-2"
                                        title={item.description}
                                    >
                                        {item.description}
                                    </p>
                                )}
                                
                                <div className="flex items-center mt-2 space-x-2 overflow-x-auto pb-1">
                                    {item.servedToPeoples && (
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                                            � Serves {item.servedToPeoples}
                                        </span>
                                    )}
                                    {item.isVegetarian && (
                                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded whitespace-nowrap">
                                            🥬 Vegetarian
                                        </span>
                                    )}
                                    {item.isSpicy && (
                                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded whitespace-nowrap">
                                            🌶️ Spicy
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="relative ml-4 w-32 h-24 flex-shrink-0 group">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover rounded-md transition-transform duration-200 group-hover:scale-105"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/128x96?text=Food+Image";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                                        <span className="text-xs text-gray-400">No Image</span>
                                    </div>
                                )}
                                <button
                                    className="absolute -bottom-2 right-6 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 hover:shadow-lg active:scale-95"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(item);
                                    }}
                                    aria-label={`Add ${item.name} to cart`}
                                >
                                    ADD +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

MenuSection.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            imageUrl: PropTypes.string,
            description: PropTypes.string,
            restaurantId: PropTypes.string.isRequired,
            servedToPeoples: PropTypes.string,
            isVegetarian: PropTypes.bool,
            isSpicy: PropTypes.bool,
        })
    ).isRequired,
};

export default memo(MenuSection);