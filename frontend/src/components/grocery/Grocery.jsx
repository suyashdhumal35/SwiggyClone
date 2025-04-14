import React, { useEffect, useState, lazy, Suspense, useMemo } from 'react';
import GrocerySkeleton from './GroceryCardSkeleton';
const GroceryCard = lazy(() => import('./GroceryCard'));

const Grocery = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const productsPerPage = 12;

    const totalPages = useMemo(() => Math.max(1, Math.ceil(totalProducts / productsPerPage)), [totalProducts]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const skip = (currentPage - 1) * productsPerPage;
                const response = await fetch(
                    `https://dummyjson.com/products?limit=${productsPerPage}&skip=${skip}`
                );

                if (!response.ok) throw new Error('Failed to fetch data');

                const data = await response.json();
                setProducts(data.products);
                setTotalProducts(data.total);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage]);

    const generatePageNumbers = useMemo(() => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    }, [currentPage, totalPages]);

    return (
        <div className="container mx-auto px-4 py-8">
            {loading ? (
                <GrocerySkeleton />
            ) : (
                <>
                    <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>

                    {error && (
                        <div className="text-center mb-6 text-red-600 bg-red-100 border border-red-300 py-2 px-4 rounded">
                            Error: {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <Suspense fallback={<GrocerySkeleton />}>
                            {products.map((product) => (
                                <GroceryCard key={product.id} product={product} />
                            ))}
                        </Suspense>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <nav className="inline-flex rounded-md shadow" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-l-md border ${
                                        currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-blue-600 hover:bg-blue-50'
                                    }`}
                                >
                                    Previous
                                </button>

                                {generatePageNumbers.map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`px-4 py-2 border-t border-b ${
                                            currentPage === pageNumber
                                                ? 'bg-blue-100 text-blue-600 font-medium'
                                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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
                </>
            )}
        </div>
    );
};

export default Grocery;
