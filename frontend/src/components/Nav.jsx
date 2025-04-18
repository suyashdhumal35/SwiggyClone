import React, { memo, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.svg';
import { FaUser, FaShoppingCart, FaHome, FaStore, FaShoppingBag, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import { IoMdRestaurant } from 'react-icons/io';
import { MdVerified, MdOutlineMail } from 'react-icons/md';

const Nav = memo(() => {
    const auth = localStorage.getItem("user");
    const navigate = useNavigate();
    const location = useLocation();
    const cartItems = useSelector((state) => state.cart.items);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const logout = () => {
        localStorage.clear();
        navigate('/signup');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="w-4/5 mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-10 md:h-12 object-cover transition-transform hover:scale-105"
                            loading="lazy"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    {auth ? (
                        <div className="flex items-center space-x-4 md:space-x-8">
                            <nav className="hidden md:block">
                                <ul className="flex space-x-1 relative">
                                    {/* Home */}
                                    <li className="relative px-3 py-2">
                                        <Link 
                                            to="/" 
                                            className={`flex items-center space-x-1 px-2 py-1 transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
                                        >
                                            <FaHome className="text-lg" />
                                            <span>Home</span>
                                        </Link>
                                        {isActive('/') && (
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-4/5 bg-blue-600 rounded-full animate-slide-up"></div>
                                        )}
                                    </li>
                                    
                                    {/* Cart */}
                                    <li className="relative px-3 py-2">
                                        <Link 
                                            to="/cart" 
                                            className={`flex items-center space-x-1 px-2 py-1 transition-colors ${isActive('/cart') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
                                        >
                                            <div className="relative">
                                                <FaShoppingCart className="text-lg" />
                                                {cartItemCount > 0 && (
                                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                                                        {cartItemCount}
                                                    </span>
                                                )}
                                            </div>
                                            <span>Cart</span>
                                        </Link>
                                        {isActive('/cart') && (
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-4/5 bg-blue-600 rounded-full animate-slide-up"></div>
                                        )}
                                    </li>
                                    
                                    {/* Add Restaurant */}
                                    <li className="relative px-3 py-2">
                                        <Link 
                                            to="/add-restaurant" 
                                            className={`flex items-center space-x-1 px-2 py-1 transition-colors ${isActive('/add-restaurant') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
                                        >
                                            <IoMdRestaurant className="text-lg" />
                                            <span>Add Restro</span>
                                        </Link>
                                        {isActive('/add-restaurant') && (
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-4/5 bg-blue-600 rounded-full animate-slide-up"></div>
                                        )}
                                    </li>
                                    
                                    {/* Grocery */}
                                    <li className="relative px-3 py-2">
                                        <Link 
                                            to="/grocery" 
                                            className={`flex items-center space-x-1 px-2 py-1 transition-colors ${isActive('/grocery') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
                                        >
                                            <FaStore className="text-lg" />
                                            <span>Grocery</span>
                                        </Link>
                                        {isActive('/grocery') && (
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-4/5 bg-blue-600 rounded-full animate-slide-up"></div>
                                        )}
                                    </li>
                                </ul>
                            </nav>

                            {/* User Profile */}
                            <div className="relative" ref={profileRef}>
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-1 focus:outline-none"
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                            {JSON.parse(auth).name?.charAt(0).toUpperCase() || 'G'}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <span className="hidden md:inline-block font-medium">
                                        {JSON.parse(auth).name || "Guest"}
                                    </span>
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 z-50 animate-fade-in">
                                        <div className="px-4 py-3 border-b">
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                                        {JSON.parse(auth).name?.charAt(0).toUpperCase() || 'G'}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                        <MdVerified className="text-white text-xs" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{JSON.parse(auth).name || "Guest"}</p>
                                                    <p className="text-sm text-gray-600 flex items-center">
                                                        <MdOutlineMail className="mr-1" />
                                                        {JSON.parse(auth).email || "No email"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <Link 
                                            to="/profile" 
                                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            <FaUser className="mr-3 text-blue-500" />
                                            <span>My Profile</span>
                                        </Link>
                                        
                                        <Link 
                                            to="/orders" 
                                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            <FaShoppingBag className="mr-3 text-blue-500" />
                                            <span>My Orders</span>
                                        </Link>
                                        
                                        <Link 
                                            to="/faqs" 
                                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            <FaQuestionCircle className="mr-3 text-blue-500" />
                                            <span>FAQs</span>
                                        </Link>
                                        
                                        <button 
                                            onClick={logout}
                                            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            <FaSignOutAlt className="mr-3 text-red-500" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/signup" 
                                className={`px-3 py-2 rounded-md font-medium transition-colors ${isActive('/signup') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                            >
                                Sign Up
                            </Link>
                            <Link 
                                to="/login" 
                                className={`px-3 py-2 rounded-md font-medium transition-colors ${isActive('/login') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                            >
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Navigation */}
            {auth && (
                <div className="md:hidden bg-white border-t fixed bottom-0 left-0 right-0 z-40">
                    <ul className="flex justify-around py-2">
                        <li className="flex-1 text-center">
                            <Link 
                                to="/" 
                                className={`flex flex-col items-center p-2 relative ${isActive('/') ? 'text-blue-600' : 'text-gray-700'}`}
                            >
                                <FaHome className="text-xl mb-1" />
                                <span className="text-xs">Home</span>
                                {isActive('/') && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-1 w-3/4 bg-blue-600 rounded-full animate-slide-up"></div>
                                )}
                            </Link>
                        </li>
                        <li className="flex-1 text-center">
                            <Link 
                                to="/cart" 
                                className={`flex flex-col items-center p-2 relative ${isActive('/cart') ? 'text-blue-600' : 'text-gray-700'}`}
                            >
                                <div className="relative">
                                    <FaShoppingCart className="text-xl mb-1" />
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs">Cart</span>
                                {isActive('/cart') && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-1 w-3/4 bg-blue-600 rounded-full animate-slide-up"></div>
                                )}
                            </Link>
                        </li>
                        <li className="flex-1 text-center">
                            <Link 
                                to="/add-restaurant" 
                                className={`flex flex-col items-center p-2 relative ${isActive('/add-restaurant') ? 'text-blue-600' : 'text-gray-700'}`}
                            >
                                <IoMdRestaurant className="text-xl mb-1" />
                                <span className="text-xs">Restro</span>
                                {isActive('/add-restaurant') && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-1 w-3/4 bg-blue-600 rounded-full animate-slide-up"></div>
                                )}
                            </Link>
                        </li>
                        <li className="flex-1 text-center">
                            <Link 
                                to="/grocery" 
                                className={`flex flex-col items-center p-2 relative ${isActive('/grocery') ? 'text-blue-600' : 'text-gray-700'}`}
                            >
                                <FaStore className="text-xl mb-1" />
                                <span className="text-xs">Grocery</span>
                                {isActive('/grocery') && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-1 w-3/4 bg-blue-600 rounded-full animate-slide-up"></div>
                                )}
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
});

export default Nav;