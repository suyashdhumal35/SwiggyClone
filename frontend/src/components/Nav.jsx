import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.svg';

const Nav = () => {
    const auth = localStorage.getItem("user");
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.items);
    
    // Calculate total items in cart (summing quantities)
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const logout = () => {
        localStorage.clear();
        navigate('/signup')
    }

    return (
        <header className="flex items-center justify-between p-4 shadow-md bg-white">
            {/* Left side - Logo */}
            <div>
                <Link to="/" >
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-12 object-cover"
                    />
                </Link>
            </div>

            {auth ?
                <>
                    {/* Right side - Navigation */}
                    <nav>
                        <ul className="flex gap-6 text-lg font-medium">
                            <li><Link to="/" className="hover:text-blue-500">Restaurants</Link></li>
                            <li className="relative">
                                <Link to="/cart" className="hover:text-blue-500 flex items-center">
                                    🛒 Cart
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                            </li>
                            <li><Link to="/add-restaurant" className="hover:text-blue-500">Add Restaurant</Link></li>
                            <li> <Link onClick={logout} to="/signup" className="hover:text-blue-500">Logout :- {(JSON.parse(auth).name || "Guest").toUpperCase()}</Link> </li>
                        </ul>
                    </nav>
                </>
                :
                <ul className="flex gap-6 text-lg font-medium ml-auto">
                    <li><Link to="/signup" className="hover:text-blue-500">Sign Up</Link></li>
                    <li><Link to="/login" className="hover:text-blue-500">Login</Link></li>
                </ul>
            }
        </header>
    );
};

export default Nav;