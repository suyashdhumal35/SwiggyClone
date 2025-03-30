import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const AddRestaurant = () => {
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState({
        name: '',
        cuisines: [],
        costForTwoMessage: '',
        imageUrl: '',
        promotion: false,
        deliveryTime: '',
        rating: 0,
        vegMenu: [],
        nonVegMenu: [],
        drinks: [],
        specialties: []
    });

    const [newCuisine, setNewCuisine] = useState('');
    const [lastId, setLastId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Menu item states
    const [vegItem, setVegItem] = useState({
        name: '', description: '', price: '', category: '', servedToPeoples: '', imageUrl: ''
    });
    const [nonVegItem, setNonVegItem] = useState({
        name: '', description: '', price: '', category: '', servedToPeoples: '', imageUrl: ''
    });
    const [drinkItem, setDrinkItem] = useState({
        name: '', description: '', price: '', category: '', servedToPeoples: '', imageUrl: ''
    });
    const [specialtyItem, setSpecialtyItem] = useState({
        name: '', description: '', price: '', category: '', servedToPeoples: '', imageUrl: ''
    });

    // Fetch last ID on component mount
    useEffect(() => {
        const fetchLastId = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/restaurants');
                if (!response.ok) throw new Error('Failed to fetch restaurants');

                const data = await response.json();
                if (data.length > 0) {
                    const maxId = Math.max(...data.map(rest => rest.id));
                    setLastId(maxId);
                }
            } catch (err) {
                console.error('Error fetching restaurants:', err);
                setError(err.message);
            }
        };

        fetchLastId();
    }, []);

    // Cloudinary image upload
    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'suyash');

        try {
            const response = await fetch(
                'https://api.cloudinary.com/v1_1/dgnxnsl0p/image/upload',
                { method: 'POST', body: formData }
            );

            if (!response.ok) throw new Error('Image upload failed');

            const data = await response.json();
            return data.secure_url;
        } catch (err) {
            console.error('Error uploading image:', err);
            setError(err.message);
            return null;
        }
    };

    // Restaurant image upload handler
    const handleRestaurantImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = await handleImageUpload(file);
            if (imageUrl) setRestaurant({ ...restaurant, imageUrl });
        }
    };

    // Menu item image upload handler
    const handleMenuItemImageUpload = async (e, setItem, item) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = await handleImageUpload(file);
            if (imageUrl) setItem({ ...item, imageUrl });
        }
    };

    // Add cuisine to the list
    const addCuisine = () => {
        if (newCuisine.trim()) {
            setRestaurant({
                ...restaurant,
                cuisines: [...restaurant.cuisines, newCuisine.trim()]
            });
            setNewCuisine('');
        }
    };

    // Remove cuisine from list
    const removeCuisine = (index) => {
        const updatedCuisines = [...restaurant.cuisines];
        updatedCuisines.splice(index, 1);
        setRestaurant({ ...restaurant, cuisines: updatedCuisines });
    };

    // Add menu item helpers
    const addVegItem = () => {
        if (vegItem.name && vegItem.description && vegItem.price && vegItem.category) {
            const newItem = {
                ...vegItem,
                id: restaurant.vegMenu.length + 1,
                price: Number(vegItem.price)
            };
            setRestaurant({
                ...restaurant,
                vegMenu: [...restaurant.vegMenu, newItem]
            });
            setVegItem({
                name: '', description: '', price: '', category: '', servedToPeoples: '', imageUrl: ''
            });
        }
    };

    const addNonVegItem = () => {
        if (nonVegItem.name && nonVegItem.description && nonVegItem.price && nonVegItem.category) {
            const newItem = {
                ...nonVegItem,
                id: restaurant.nonVegMenu.length + 1,
                price: Number(nonVegItem.price)
            };
            setRestaurant({
                ...restaurant,
                nonVegMenu: [...restaurant.nonVegMenu, newItem]
            });
            setNonVegItem({
                name: '', description: '', price: '', category: '', servedToPeoples: '', imageUrl: ''
            });
        }
    };

    const addDrinkItem = () => {
        if (drinkItem.name && drinkItem.description && drinkItem.price && drinkItem.category) {
            const newItem = {
                ...drinkItem,
                id: restaurant.drinks.length + 1,
                price: Number(drinkItem.price)
            };
            setRestaurant({
                ...restaurant,
                drinks: [...restaurant.drinks, newItem]
            });
            setDrinkItem({
                name: '', description: '', price: '', category: '', servedToPeoples: '', imageUrl: ''
            });
        }
    };

    const addSpecialtyItem = () => {
        if (specialtyItem.name && specialtyItem.description && specialtyItem.price && specialtyItem.category) {
            const newItem = {
                ...specialtyItem,
                id: restaurant.specialties.length + 1,
                price: Number(specialtyItem.price)
            };
            setRestaurant({
                ...restaurant,
                specialties: [...restaurant.specialties, newItem]
            });
            setSpecialtyItem({
                name: '', description: '', price: '', category: '', servedToPeoples: '', imageUrl: ''
            });
        }
    };

    // Remove menu item
    const removeMenuItem = (menuType, index) => {
        const updatedMenu = [...restaurant[menuType]];
        updatedMenu.splice(index, 1);
        setRestaurant({ ...restaurant, [menuType]: updatedMenu });
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newRestaurant = {
                ...restaurant,
                id: lastId + 1,
                rating: Number(restaurant.rating)
            };

            const response = await fetch('http://127.0.0.1:5000/add-restaurant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRestaurant)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add restaurant');
            }

            alert('Restaurant added successfully!');
            navigate("/");  // Add this line to navigate to home page
            // Reset form
            setRestaurant({
                name: '',
                cuisines: [],
                costForTwoMessage: '',
                imageUrl: '',
                promotion: false,
                deliveryTime: '',
                rating: 0,
                vegMenu: [],
                nonVegMenu: [],
                drinks: [],
                specialties: []
            });
            setLastId(lastId + 1);
        } catch (err) {
            console.error('Error adding restaurant:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Add New Restaurant</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Restaurant Information Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Restaurant Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={restaurant.name}
                                onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        {/* Cuisines */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cuisines</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={newCuisine}
                                    onChange={(e) => setNewCuisine(e.target.value)}
                                    className="flex-1 p-2 border rounded-l"
                                    placeholder="Add cuisine"
                                />
                                <button
                                    type="button"
                                    onClick={addCuisine}
                                    className="bg-blue-500 text-white px-4 rounded-r"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap mt-2">
                                {restaurant.cuisines.map((cuisine, index) => (
                                    <div key={index} className="bg-gray-100 px-2 py-1 rounded mr-2 mb-2 flex items-center">
                                        {cuisine}
                                        <button
                                            type="button"
                                            onClick={() => removeCuisine(index)}
                                            className="ml-1 text-red-500"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cost for Two */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cost for Two</label>
                            <input
                                type="text"
                                value={restaurant.costForTwoMessage}
                                onChange={(e) => setRestaurant({ ...restaurant, costForTwoMessage: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        {/* Delivery Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                            <input
                                type="text"
                                value={restaurant.deliveryTime}
                                onChange={(e) => setRestaurant({ ...restaurant, deliveryTime: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <input
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                value={restaurant.rating}
                                onChange={(e) => setRestaurant({ ...restaurant, rating: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        {/* Promotion */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="promotion"
                                checked={restaurant.promotion}
                                onChange={(e) => setRestaurant({ ...restaurant, promotion: e.target.checked })}
                                className="mr-2"
                            />
                            <label htmlFor="promotion" className="text-sm font-medium text-gray-700">
                                Promotion Available
                            </label>
                        </div>

                        {/* Restaurant Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleRestaurantImageUpload}
                                className="w-full p-2 border rounded"
                            />
                            {restaurant.imageUrl && (
                                <div className="mt-2">
                                    <img src={restaurant.imageUrl} alt="Restaurant" className="h-20 w-20 object-cover rounded" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Veg Menu Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Veg Menu</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Veg Item Form Fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={vegItem.name}
                                onChange={(e) => setVegItem({ ...vegItem, name: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                                type="text"
                                value={vegItem.description}
                                onChange={(e) => setVegItem({ ...vegItem, description: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                                type="number"
                                value={vegItem.price}
                                onChange={(e) => setVegItem({ ...vegItem, price: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                value={vegItem.category}
                                onChange={(e) => setVegItem({ ...vegItem, category: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Serves</label>
                            <input
                                type="text"
                                value={vegItem.servedToPeoples}
                                onChange={(e) => setVegItem({ ...vegItem, servedToPeoples: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleMenuItemImageUpload(e, setVegItem, vegItem)}
                                className="w-full p-2 border rounded"
                            />
                            {vegItem.imageUrl && (
                                <div className="mt-2">
                                    <img src={vegItem.imageUrl} alt="Veg Item" className="h-20 w-20 object-cover rounded" />
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={addVegItem}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        disabled={!vegItem.name || !vegItem.description || !vegItem.price || !vegItem.category}
                    >
                        Add Veg Item
                    </button>

                    {restaurant.vegMenu.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Veg Menu Items:</h3>
                            <ul className="space-y-2">
                                {restaurant.vegMenu.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                        <div>
                                            <span className="font-medium">{item.name}</span> - ₹{item.price}
                                            {item.imageUrl && (
                                                <img src={item.imageUrl} alt={item.name} className="h-10 w-10 object-cover rounded inline-block ml-2" />
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeMenuItem('vegMenu', index)}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Non-Veg Menu Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Non-Veg Menu</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Non-Veg Item Form Fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={nonVegItem.name}
                                onChange={(e) => setNonVegItem({ ...nonVegItem, name: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                                type="text"
                                value={nonVegItem.description}
                                onChange={(e) => setNonVegItem({ ...nonVegItem, description: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                                type="number"
                                value={nonVegItem.price}
                                onChange={(e) => setNonVegItem({ ...nonVegItem, price: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                value={nonVegItem.category}
                                onChange={(e) => setNonVegItem({ ...nonVegItem, category: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Serves</label>
                            <input
                                type="text"
                                value={nonVegItem.servedToPeoples}
                                onChange={(e) => setNonVegItem({ ...nonVegItem, servedToPeoples: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleMenuItemImageUpload(e, setNonVegItem, nonVegItem)}
                                className="w-full p-2 border rounded"
                            />
                            {nonVegItem.imageUrl && (
                                <div className="mt-2">
                                    <img src={nonVegItem.imageUrl} alt="Non-Veg Item" className="h-20 w-20 object-cover rounded" />
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={addNonVegItem}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        disabled={!nonVegItem.name || !nonVegItem.description || !nonVegItem.price || !nonVegItem.category}
                    >
                        Add Non-Veg Item
                    </button>

                    {restaurant.nonVegMenu.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Non-Veg Menu Items:</h3>
                            <ul className="space-y-2">
                                {restaurant.nonVegMenu.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                        <div>
                                            <span className="font-medium">{item.name}</span> - ₹{item.price}
                                            {item.imageUrl && (
                                                <img src={item.imageUrl} alt={item.name} className="h-10 w-10 object-cover rounded inline-block ml-2" />
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeMenuItem('nonVegMenu', index)}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Drinks Menu Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Drinks Menu</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Drink Item Form Fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={drinkItem.name}
                                onChange={(e) => setDrinkItem({ ...drinkItem, name: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                                type="text"
                                value={drinkItem.description}
                                onChange={(e) => setDrinkItem({ ...drinkItem, description: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                                type="number"
                                value={drinkItem.price}
                                onChange={(e) => setDrinkItem({ ...drinkItem, price: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                value={drinkItem.category}
                                onChange={(e) => setDrinkItem({ ...drinkItem, category: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Serves</label>
                            <input
                                type="text"
                                value={drinkItem.servedToPeoples}
                                onChange={(e) => setDrinkItem({ ...drinkItem, servedToPeoples: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleMenuItemImageUpload(e, setDrinkItem, drinkItem)}
                                className="w-full p-2 border rounded"
                            />
                            {drinkItem.imageUrl && (
                                <div className="mt-2">
                                    <img src={drinkItem.imageUrl} alt="Drink Item" className="h-20 w-20 object-cover rounded" />
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={addDrinkItem}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        disabled={!drinkItem.name || !drinkItem.description || !drinkItem.price || !drinkItem.category}
                    >
                        Add Drink Item
                    </button>

                    {restaurant.drinks.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Drinks Menu Items:</h3>
                            <ul className="space-y-2">
                                {restaurant.drinks.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                        <div>
                                            <span className="font-medium">{item.name}</span> - ₹{item.price}
                                            {item.imageUrl && (
                                                <img src={item.imageUrl} alt={item.name} className="h-10 w-10 object-cover rounded inline-block ml-2" />
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeMenuItem('drinks', index)}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Specialties Menu Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Specialties Menu</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Specialty Item Form Fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={specialtyItem.name}
                                onChange={(e) => setSpecialtyItem({ ...specialtyItem, name: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                                type="text"
                                value={specialtyItem.description}
                                onChange={(e) => setSpecialtyItem({ ...specialtyItem, description: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                                type="number"
                                value={specialtyItem.price}
                                onChange={(e) => setSpecialtyItem({ ...specialtyItem, price: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                value={specialtyItem.category}
                                onChange={(e) => setSpecialtyItem({ ...specialtyItem, category: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Serves</label>
                            <input
                                type="text"
                                value={specialtyItem.servedToPeoples}
                                onChange={(e) => setSpecialtyItem({ ...specialtyItem, servedToPeoples: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleMenuItemImageUpload(e, setSpecialtyItem, specialtyItem)}
                                className="w-full p-2 border rounded"
                            />
                            {specialtyItem.imageUrl && (
                                <div className="mt-2">
                                    <img src={specialtyItem.imageUrl} alt="Specialty Item" className="h-20 w-20 object-cover rounded" />
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={addSpecialtyItem}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        disabled={!specialtyItem.name || !specialtyItem.description || !specialtyItem.price || !specialtyItem.category}
                    >
                        Add Specialty Item
                    </button>

                    {restaurant.specialties.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Specialty Items:</h3>
                            <ul className="space-y-2">
                                {restaurant.specialties.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                        <div>
                                            <span className="font-medium">{item.name}</span> - ₹{item.price}
                                            {item.imageUrl && (
                                                <img src={item.imageUrl} alt={item.name} className="h-10 w-10 object-cover rounded inline-block ml-2" />
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeMenuItem('specialties', index)}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Restaurant'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRestaurant;