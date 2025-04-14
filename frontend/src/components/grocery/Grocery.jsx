import React, { useEffect, useState, lazy, Suspense } from 'react';
import GroceryCardSkeleton from './GroceryCardSkeleton'; // ✅ Import the skeleton

// Lazy load the GroceryCard component
const GroceryCard = lazy(() => import('./GroceryCard'));

const Grocery = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const skip = (currentPage - 1) * productsPerPage;
                const response = await fetch(
                    `https://dummyjson.com/products?limit=${productsPerPage}&skip=${skip}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setProducts(data.products);
                setTotalProducts(data.total);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, productsPerPage]);

    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    if (loading && products.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Suspense key={product.id} fallback={<GroceryCardSkeleton />}>
                        <GroceryCard product={product} />
                    </Suspense>
                ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <nav className="inline-flex rounded-md shadow">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-l-md border ${
                                currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            Previous
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                                pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                                pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNumber = totalPages - 4 + i;
                            } else {
                                pageNumber = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => paginate(pageNumber)}
                                    className={`px-4 py-2 border-t border-b ${
                                        currentPage === pageNumber
                                            ? 'bg-blue-100 text-blue-600 font-medium'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-r-md border ${
                                currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}

            <div className="text-center mt-4 text-gray-600">
                Page {currentPage} of {totalPages} | Showing {products.length} of {totalProducts} products
            </div>
        </div>
    );
};

export default Grocery;
