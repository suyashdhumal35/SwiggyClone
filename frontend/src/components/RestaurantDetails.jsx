import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import MenuSection from "./MenuSection";

const RestaurantDetails = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const fetchRestaurant = useCallback(async () => {
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
    }, [id]);

    useEffect(() => {
        fetchRestaurant();
    }, [fetchRestaurant]);

    const menuSections = useMemo(() => {
        if (!restaurant) return [];
        
        return [
            { title: "Veg Menu", items: restaurant.vegMenu },
            { title: "Non-Veg Menu", items: restaurant.nonVegMenu },
            { title: "Drinks", items: restaurant.drinks },
            { title: "Speciality", items: restaurant.speciality }
        ].filter(section => section.items && section.items.length > 0);
    }, [restaurant]);

    const handleImageError = useCallback((e) => {
        e.target.onerror = null;
        e.target.src = "https://via.placeholder.com/1200x400?text=Restaurant+Image";
    }, []);

    if (loading) return (
        <div className="text-center mt-10 text-lg font-semibold animate-pulse">
            Loading restaurant details...
        </div>
    );

    if (error) return (
        <div className="text-center text-red-500 text-lg mt-10">
            Error: {error}
        </div>
    );

    if (!restaurant) return (
        <div className="text-center mt-10 text-lg">
            Restaurant not found
        </div>
    );

    const cuisines = restaurant.cuisine || restaurant.cuisines?.join(", ") || "Not specified";

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-6"> {/* Increased max-width to 6xl */}
            {/* Restaurant Image - Wider but same height */}
            <div className="relative h-80 w-full"> {/* Fixed height of 80 (h-80) */}
                <img 
                    src={restaurant.imageUrl} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    loading="lazy"
                    onError={handleImageError}
                />
            </div>

            {/* Restaurant Info */}
            <div className="mt-6 space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                        <span className="text-gray-500 text-sm whitespace-nowrap">
                            ⏳ {restaurant.deliveryTime}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-gray-700 font-semibold">
                            {restaurant.rating}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-2">
                    <p className="text-gray-700">
                        <span className="font-medium">Cuisines:</span> {cuisines}
                    </p>
                    <p className="text-gray-600 font-medium">
                        {restaurant.costForTwoMessage}
                    </p>
                </div>
            </div>

            {/* Menus */}
            <div className="mt-8 space-y-6">
                {menuSections.map((section) => (
                    <MenuSection 
                        key={section.title}
                        title={section.title}
                        items={section.items}
                    />
                ))}
            </div>
        </div>
    );
};

export default RestaurantDetails;