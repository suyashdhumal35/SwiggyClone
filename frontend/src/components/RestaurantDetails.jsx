import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cartSlice";

const RestaurantDetails = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/restaurants");
                if (!response.ok) throw new Error("Failed to fetch");

                const data = await response.json();
                const foundRestaurant = data.find((rest) => rest._id === id);

                if (!foundRestaurant) {
                    setError("Restaurant not found");
                } else {
                    setRestaurant(foundRestaurant);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [id]);

    if (loading) return <div className="text-center mt-10 text-lg font-semibold">Loading...</div>;
    if (error) return <div className="text-center text-red-500 text-lg mt-10">Error: {error}</div>;

    return (
        <div className="w-4/6 mx-auto p-6">
            {/* Restaurant Image */}
            <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-80 object-cover rounded-lg shadow-lg" />

            {/* Restaurant Info */}
            <div className="mt-6 flex flex-col space-y-1">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                        <span className="text-gray-500 text-sm">⏳ {restaurant.deliveryTime}</span>
                    </div>
                    <p className="text-green-600 text-lg font-semibold">⭐ {restaurant.rating} Rating</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-700 text-lg">Cuisines: {restaurant.cuisines.join(", ")}</p>
                    <p className="text-gray-600 text-lg">{restaurant.costForTwoMessage}</p>
                </div>
            </div>
            {/* Menus */}
            <div className="mt-8">
                <MenuSection title="Veg Menu" items={restaurant.vegMenu} />
                <MenuSection title="Non-Veg Menu" items={restaurant.nonVegMenu} />
                <MenuSection title="Drinks" items={restaurant.drinks} />
                <MenuSection title="Speciality" items={restaurant.speciality} />
            </div>
        </div>
    );
};

// MenuSection Component (Collapsible menu layout)
const MenuSection = ({ title, items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const handleAddToCart = (item) => {
        dispatch(addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            description: item.description,
            restaurantId: item.restaurantId // Add this if you need to track which restaurant the item belongs to
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
                                        handleAddToCart(item);
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

export default RestaurantDetails;