import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "./RestaurantCard";

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/restaurants");
            if (!response.ok) {
                throw new Error("No Restaurants Found");
            }
            const data = await response.json();
            console.log("Fetched Restaurants Data:", data);
            setRestaurants(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (id) => {
        console.log("Clicked Restaurant ID:", id);
        navigate(`/restaurant/${id}`);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Restaurant List</h1>

            {loading && <p className="text-blue-500 text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant._id} restaurant={restaurant} onClick={handleCardClick} />
                ))}
            </div>
        </div>
    );
};

export default RestaurantList;
