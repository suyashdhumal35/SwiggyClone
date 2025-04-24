import React, { useEffect, useState, lazy, Suspense, useMemo } from 'react';
import GrocerySkeleton from './GroceryCardSkeleton';
import Pagination from './Pagination';
const GroceryCard = lazy(() => import('./GroceryCard'));

const Grocery = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRanges, setPriceRanges] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState('all');
    const productsPerPage = 10;

    // Calculate total products and pages based on filtered products
    const totalProducts = useMemo(() => filteredProducts.length, [filteredProducts]);
    const totalPages = useMemo(() => Math.max(1, Math.ceil(totalProducts / productsPerPage)), [totalProducts]);

    // Get current page products
    const products = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return filteredProducts.slice(startIndex, startIndex + productsPerPage);
    }, [filteredProducts, currentPage]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all products with limit=0
                const response = await fetch('https://dummyjson.com/products?limit=0');
                
                if (!response.ok) throw new Error('Failed to fetch data');

                const data = await response.json();
                setAllProducts(data.products);
                
                // Extract unique categories
                const uniqueCategories = [...new Set(data.products.map(product => product.category))];
                setCategories(uniqueCategories);
                
                // Generate price ranges
                const maxPrice = Math.max(...data.products.map(p => p.price));
                const ranges = [];
                let start = 0;
                const increment = 5000;
                
                while (start < maxPrice) {
                    const end = start + increment;
                    ranges.push({
                        label: `$${start}-${end}`,
                        min: start,
                        max: end
                    });
                    start = end;
                }
                
                // Add one more range if there are remaining prices
                if (start < maxPrice) {
                    ranges.push({
                        label: `$${start}+`,
                        min: start,
                        max: Infinity
                    });
                }
                
                setPriceRanges(ranges);
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter products when search, category or price changes
    useEffect(() => {
        let result = allProducts;
        
        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(product => 
                product.title.toLowerCase().includes(query) || 
                product.description.toLowerCase().includes(query)
            );
        }
        
        // Apply category filter
        if (selectedCategory !== 'all') {
            result = result.filter(product => product.category === selectedCategory);
        }
        
        // Apply price range filter
        if (selectedPriceRange !== 'all') {
            const range = priceRanges.find(r => r.label === selectedPriceRange);
            if (range) {
                result = result.filter(product => 
                    product.price >= range.min && product.price <= range.max
                );
            }
        }
        
        setFilteredProducts(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchQuery, selectedCategory, selectedPriceRange, allProducts, priceRanges]);

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

    // Split products into two rows of 5 items each
    const row1 = products.slice(0, 5);
    const row2 = products.slice(5, 10);

    return (
        <div className="container mx-auto px-4 py-8">
            {loading ? (
                <GrocerySkeleton />
            ) : (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        {/* Search input on the left */}
                        <div className="w-full md:w-1/3">
                            <label htmlFor="search" className="sr-only">Search products</label>
                            <input
                                type="text"
                                id="search"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        {/* Filters on the right */}
                        <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-4 justify-end items-start md:items-center">
                            {/* Price range filter */}
                            <div className="w-full md:w-1/3">
                                <label htmlFor="price-range" className="sr-only">Price Range</label>
                                <select
                                    id="price-range"
                                    value={selectedPriceRange}
                                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Price Ranges</option>
                                    {priceRanges.map((range) => (
                                        <option key={range.label} value={range.label}>
                                            {range.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Category filter */}
                            <div className="w-full md:w-1/3">
                                <label htmlFor="category-filter" className="sr-only">Filter by category</label>
                                <select
                                    id="category-filter"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1> */}

                    {error && (
                        <div className="text-center mb-6 text-red-600 bg-red-100 border border-red-300 py-2 px-4 rounded">
                            Error: {error}
                        </div>
                    )}

{filteredProducts.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No products found matching your criteria.
                        </div>
                    ) : (
                        <>
                            {/* First row of 5 items */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
                                <Suspense fallback={<GrocerySkeleton />}>
                                    {row1.map((product) => (
                                        <GroceryCard key={product.id} product={product} />
                                    ))}
                                </Suspense>
                            </div>
                            
                            {/* Second row of 5 items */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                <Suspense fallback={<GrocerySkeleton />}>
                                    {row2.map((product) => (
                                        <GroceryCard key={product.id} product={product} />
                                    ))}
                                </Suspense>
                            </div>

                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    generatePageNumbers={generatePageNumbers}
                                />
                            )}

                            <div className="text-center mt-4 text-gray-600">
                                Showing {products.length} of {totalProducts} products
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Grocery;