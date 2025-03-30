import { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cartSlice";

const MenuSection = ({ title, items, restaurant }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const handleAddItem = (item) => {
        dispatch(addItem({
            ...item,
            restaurantId: restaurant._id,
            restaurantName: restaurant.name
        }));
    };

    return (
        <div className="mt-3 border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <div
                className="flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 p-4 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                    <span className="bg-gray-200 text-gray-600 px-2 py-1 text-xs rounded-full">
                        {items.length} items
                    </span>
                </div>
                <span className="text-gray-500">{isOpen ? '🔼' : '🔽'}</span>
            </div>

            {isOpen && (
                <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                        <div key={item.id} className="flex p-4 hover:bg-gray-50 transition-colors">
                            {/* Menu Info */}
                            <div className="flex-1">
                                <h3 className="text-md font-semibold text-gray-800">{item.name}</h3>
                                {item.description && (
                                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                )}
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex space-x-2">
                                        {item.servedToPeoples && (
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                🍽️ Serves {item.servedToPeoples}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-md font-bold text-gray-900">₹{item.price}</span>
                                </div>
                            </div>

                            {/* Menu Image and Add Button */}
                            <div className="relative ml-4 w-32 h-24 flex-shrink-0">
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover rounded-md"
                                />
                                <button
                                    className="absolute -bottom-2 right-6 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full shadow-md"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddItem(item);
                                    }}
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

export default MenuSection;