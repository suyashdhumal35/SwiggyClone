import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import logo from "../assets/logo.svg"


const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8 w-full mt-auto">
            <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Section - Logo & About */}
                    <div>
                        <img src={logo} alt="Logo" className="h-16 mb-4" />
                        <p className="text-gray-400">
                            Your one-stop shop for the best products. Quality and affordability in one place.
                        </p>
                    </div>

                    {/* Middle Section - Quick Links */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                            <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Right Section - Social Media */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Follow Us</h2>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white"><FaFacebook size={24} /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><FaInstagram size={24} /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><FaTwitter size={24} /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><FaLinkedin size={24} /></a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Copyright */}
                <div className="mt-8 text-center text-gray-500 text-sm border-t border-gray-700 pt-4">
                    © {new Date().getFullYear()} Suyash Enterprice . All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
