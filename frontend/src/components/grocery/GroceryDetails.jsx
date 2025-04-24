import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/cartSlice';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://dummyjson.com/products/${id}`);
                if (!response.ok) throw new Error('Failed to fetch product');
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product.stock <= 0) return;
        
        dispatch(addItem({
            id: product.id,
            name: product.title,
            price: product.price,
            imageUrl: product.thumbnail,
            quantity: 1
        }));
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
    
    if (error) return (
        <div className="container mx-auto px-4 py-8 text-center text-red-500">
            Error: {error}
        </div>
    );
    
    if (!product) return (
        <div className="container mx-auto px-4 py-8 text-center">
            Product not found
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                {/* Main Product Info */}
                <div className="md:flex">
                    {/* Product Image */}
                    <div className="md:w-1/2 p-4">
                        <img 
                            src={product.thumbnail} 
                            alt={product.title} 
                            className="w-full h-96 object-contain rounded-lg"
                        />
                    </div>
                    
                    {/* Product Details */}
                    <div className="p-6 md:w-1/2">
                        <div className="mb-4">
                            <span className="text-sm text-gray-500 capitalize">{product.category}</span>
                            <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
                            <p className="text-gray-600">by {product.brand}</p>
                        </div>
                        
                        {/* Price Section */}
                        <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">
                                    ${product.price.toFixed(2)}
                                </span>
                                {product.discountPercentage > 0 && (
                                    <>
                                        <span className="text-sm text-gray-500 line-through">
                                            ${(product.price / (1 - product.discountPercentage/100)).toFixed(2)}
                                        </span>
                                        <span className="text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded">
                                            {product.discountPercentage}% off
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        {/* Rating and Stock */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <svg 
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                ))}
                                <span className="text-gray-600 ml-1 text-sm">
                                    {product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)
                                </span>
                            </div>
                            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                            </span>
                        </div>
                        
                        {/* Description */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                            <p className="text-gray-600">{product.description}</p>
                        </div>
                        
                        {/* Additional Info */}
                        {product.weight && (
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Product Details</h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    {product.weight && <li>Weight: {product.weight} oz</li>}
                                    {product.dimensions && (
                                        <li>Dimensions: {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm</li>
                                    )}
                                    {product.warrantyInformation && <li>Warranty: {product.warrantyInformation}</li>}
                                </ul>
                            </div>
                        )}
                        
                        {/* Add to Cart Button */}
                        <button 
                            className={`w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-lg transition-colors
                                ${product.stock > 0 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                            `}
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
                
                {/* Additional Images */}
                {product.images?.length > 1 && (
                    <div className="p-6 border-t">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Product Gallery</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {product.images.map((image, index) => (
                                <img 
                                    key={index}
                                    src={image} 
                                    alt={`${product.title} ${index + 1}`}
                                    className="w-full h-32 object-contain border rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Reviews Section */}
                {product.reviews?.length > 0 && (
                    <div className="p-6 border-t">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
                        <div className="space-y-4">
                            {product.reviews.map((review, index) => (
                                <div key={index} className="border-b pb-4 last:border-0">
                                    <div className="flex items-center mb-2">
                                        <div className="flex items-center mr-2">
                                            {[...Array(5)].map((_, i) => (
                                                <svg 
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="font-medium text-gray-800">{review.reviewerName}</span>
                                    </div>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;