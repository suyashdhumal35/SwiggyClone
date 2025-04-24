import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/cartSlice';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = () => {
        navigate(`/grocery/product/${product.id}`);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        dispatch(addItem({
            id: product.id,
            name: product.title,
            price: product.price,
            imageUrl: product.thumbnail,
            quantity: 1
        }));
    };

    // Calculate original price if there's a discount
    const originalPrice = product.discountPercentage > 0
        ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
        : null;

    return (
        <div
            className="bg-gray-50 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-200 hover:translate-y-[-2px]"
            onClick={handleClick}
        >
            {/* Image with discount badge */}
            <div className="relative">
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-48 object-cover border-b border-gray-200"
                />
                {product.discountPercentage > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.discountPercentage}% OFF
                    </div>
                )}
            </div>

            {/* Product details */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="w-3/4">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h3>
                        <p className="text-gray-500 text-sm">{product.brand}</p>
                    </div>
                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                        <svg
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm font-medium text-gray-700">
                            {product.rating.toFixed(1)}
                        </span>
                    </div>
                </div>

                {/* Price section (now on left) and add button on right */}
                <div className="flex justify-between items-center">
                    <div className="text-left">
                        <span className="text-lg font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                        </span>
                        {originalPrice && (
                            <div className="text-xs text-gray-500 line-through">
                                ${originalPrice}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className={`py-1 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors
                            ${product.stock > 0
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                        `}
                        disabled={product.stock <= 0}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        <span className="text-sm">{product.stock > 0 ? 'Add' : 'Sold'}</span>
                    </button>
                </div>

                {/* Stock indicator */}
                {product.stock <= 10 && product.stock > 0 && (
                    <div className="mt-2 text-xs text-orange-600 text-left">
                        Only {product.stock} left!
                    </div>
                )}
            </div>
        </div>
    );
};
export default ProductCard;