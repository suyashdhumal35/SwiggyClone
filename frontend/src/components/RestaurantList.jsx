import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "./RestaurantCard";

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showTopRated, setShowTopRated] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();

    // Memoized fetch function
    const fetchRestaurants = useCallback(async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/restaurants");
            if (!response.ok) throw new Error("No Restaurants Found");
            const data = await response.json();
            setRestaurants(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch restaurants on mount
    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

    // Memoized suggestions calculation
    const suggestions = useMemo(() => {
        return [...new Set(
            restaurants.flatMap(restaurant => [
                restaurant.name,
                restaurant.cuisine
            ].filter(Boolean))
        )]
        .filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 8);
    }, [restaurants, searchTerm]);

    // Memoized filtered restaurants calculation
    const filteredRestaurants = useMemo(() => {
        return restaurants.filter(restaurant => {
            const matchesSearch = searchTerm 
                ? restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  (restaurant.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()))
                : true;
            
            const matchesRating = showTopRated ? restaurant.rating > 4 : true;
            
            return matchesSearch && matchesRating;
        });
    }, [restaurants, searchTerm, showTopRated]);

    // Memoized event handlers
    const handleCardClick = useCallback((id) => navigate(`/restaurant/${id}`), [navigate]);
    const toggleTopRated = useCallback(() => setShowTopRated(prev => !prev), []);
    const handleSuggestionClick = useCallback((suggestion) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
    }, []);

    // Derived state for empty results message
    const emptyResultsMessage = useMemo(() => {
        if (showTopRated && searchTerm) {
            return "No top rated restaurants found matching your search.";
        } else if (showTopRated) {
            return "No top rated restaurants available.";
        }
        return "No restaurants found matching your search.";
    }, [showTopRated, searchTerm]);

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6 relative">
                <div className="flex-grow relative">
                    <input
                        type="text"
                        placeholder="Search restaurants by name or cuisine..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                            {suggestions.map((suggestion, index) => (
                                <li 
                                    key={`${suggestion}-${index}`}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button
                    onClick={toggleTopRated}
                    className={`px-6 py-3 w-32 rounded-lg font-medium ${
                        showTopRated ? 'bg-orange-500' : 'bg-orange-400 hover:bg-orange-500'
                    } text-white transition-colors duration-200`}
                >
                    {showTopRated ? 'Show All' : 'Top Rated'}
                </button>
            </div>

            {loading ? (
                <p className="text-blue-500 text-center">Loading...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : filteredRestaurants.length === 0 ? (
                <p className="text-center text-gray-500">{emptyResultsMessage}</p>
            ) : (
                <>
                    {showTopRated && (
                        <h2 className="text-xl font-semibold mb-4">
                            Top Rated Restaurants {searchTerm && `matching "${searchTerm}"`}
                        </h2>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredRestaurants.map(restaurant => (
                            <RestaurantCard 
                                key={restaurant._id} 
                                restaurant={restaurant} 
                                onClick={handleCardClick} 
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default React.memo(RestaurantList);