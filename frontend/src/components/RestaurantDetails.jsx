import { useState, useEffect } from "react";
import { data, useParams } from "react-router-dom";
import MenuSection from "./MenuSection";

const RestaurantDetails = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/restaurants/${id}`);
                if (!response.ok) {
                    throw new Error("Restaurant not found");
                }
                const data = await response.json();
                setRestaurant(data);
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
    if (!restaurant) return <div className="text-center mt-10 text-lg">Restaurant not found</div>;

    return (
        <div className="w-4/6 mx-auto p-6">
            {/* Restaurant Image */}
            <img 
                src={restaurant.imageUrl} 
                alt={restaurant.name} 
                className="w-full h-80 object-cover rounded-lg shadow-lg" 
                onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://via.placeholder.com/800x400?text=Restaurant+Image";
                }}
            />

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
                    <p className="text-gray-700 text-lg">
                        Cuisines: {restaurant.cuisine || restaurant.cuisines?.join(", ") || "Not specified"}
                    </p>
                    <p className="text-gray-600 text-lg">{restaurant.costForTwoMessage}</p>
                </div>
            </div>

            {/* Menus */}
            <div className="mt-8">
                {restaurant.vegMenu && restaurant.vegMenu.length > 0 && (
                    <MenuSection title="Veg Menu" items={restaurant.vegMenu} />
                )}
                {restaurant.nonVegMenu && restaurant.nonVegMenu.length > 0 && (
                    <MenuSection title="Non-Veg Menu" items={restaurant.nonVegMenu} />
                )}
                {restaurant.drinks && restaurant.drinks.length > 0 && (
                    <MenuSection title="Drinks" items={restaurant.drinks} />
                )}
                {restaurant.speciality && restaurant.speciality.length > 0 && (
                    <MenuSection title="Speciality" items={restaurant.speciality} />
                )}
            </div>
        </div>
    );
};

export default RestaurantDetails;