import React from 'react';
import { useNavigate } from 'react-router-dom';

const GroceryCard = ({ product }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/grocery/product/${product.id}`);
    };

    return (
        <div 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleClick}
        >
            <img 
                src={product.thumbnail} 
                alt={product.title} 
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                <div className="flex justify-between items-center">
                    <span className="font-bold">${product.price}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {product.rating} ★
                    </span>
                </div>
            </div>
        </div>
    );
};

export default GroceryCard;