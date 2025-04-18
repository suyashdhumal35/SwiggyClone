import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const GroceryDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2">
                        <img 
                            src={product.thumbnail} 
                            alt={product.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-8 md:w-1/2">
                        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
                        <p className="text-gray-600 mb-4">{product.brand}</p>
                        <div className="mb-4">
                            <span className="text-2xl font-bold">${product.price}</span>
                            <span className="text-sm text-gray-500 ml-2">
                                ({product.discountPercentage}% off)
                            </span>
                        </div>
                        <div className="mb-4">
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {product.rating} ★
                            </span>
                        </div>
                        <p className="text-gray-700 mb-6">{product.description}</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Add to Cart
                        </button>
                    </div>
                </div>
                <div className="p-8 border-t">
                    <h2 className="text-xl font-bold mb-4">Additional Images</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((image, index) => (
                            <img 
                                key={index}
                                src={image} 
                                alt={`${product.title} ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroceryDetails;