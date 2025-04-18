import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/cartSlice';

const GroceryCard = ({ product }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = () => {
        navigate(`/grocery/product/${product.id}`);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Prevent navigation when clicking the button
        dispatch(addItem({
            id: product.id,
            name: product.title,
            price: product.price,
            imageUrl: product.thumbnail,
            quantity: 1
        }));
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
                <button 
                    onClick={handleAddToCart}
                    className="mt-3 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default GroceryCard;