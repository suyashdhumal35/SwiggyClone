import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "./RestaurantCard";

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [displayedRestaurants, setDisplayedRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showTopRated, setShowTopRated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurants();
    }, []);

    useEffect(() => {
        // Apply both search and filter when either changes
        let results = restaurants;
    
        // Apply search filter
        if (searchTerm) {
            results = results.filter(restaurant =>
                restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (restaurant.cuisine && restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())) 
                // || (restaurant.address && restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()))
            ); 
        }
    
        // Apply top-rated filter
        if (showTopRated) {
            results = results.filter(restaurant => restaurant.rating > 4);
        }
    
        setDisplayedRestaurants(results);
    }, [searchTerm, showTopRated, restaurants]);
    

    const fetchRestaurants = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/restaurants");
            if (!response.ok) {
                throw new Error("No Restaurants Found");
            }
            const data = await response.json();
            console.log("Fetched Restaurants Data:", data);
            setRestaurants(data);
            setDisplayedRestaurants(data);
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleTopRated = () => {
        setShowTopRated(!showTopRated);
    };

    return (
        <div className="container mx-auto p-6">
            {/* <h1 className="text-3xl font-bold mb-6 text-center">Restaurant List</h1> */}
            
            {/* Search Bar and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search restaurants by name or cuisine..."
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button
                    onClick={toggleTopRated}
                    className={`px-6 py-3 w-40 rounded-lg font-medium ${showTopRated 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-orange-400 text-white hover:bg-orange-500'}`}
                >
                    {showTopRated ? 'Show All' : 'Top Rated '}
                </button>
            </div>

            {loading && <p className="text-blue-500 text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {!loading && !error && (
                <>
                    {displayedRestaurants.length === 0 ? (
                        <p className="text-center text-gray-500">
                            {showTopRated && searchTerm
                                ? "No top rated restaurants found matching your search."
                                : showTopRated
                                    ? "No top rated restaurants available."
                                    : "No restaurants found matching your search."}
                        </p>
                    ) : (
                        <>
                            {showTopRated && (
                                <h2 className="text-xl font-semibold mb-4">
                                    Top Rated Restaurants {searchTerm && `matching "${searchTerm}"`}
                                </h2>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {displayedRestaurants.map((restaurant) => (
                                    <RestaurantCard 
                                        key={restaurant._id} 
                                        restaurant={restaurant} 
                                        onClick={handleCardClick} 
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default RestaurantList;