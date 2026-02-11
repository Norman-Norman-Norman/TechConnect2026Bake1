import { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';

interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  category: string;
  discount?: number;
}

interface Supplier {
  supplierId: number;
  name: string;
}

const CATEGORIES = [
  'Feeding & Hydration',
  'Smart Monitoring',
  'Interactive Entertainment',
  'Comfort & Wellness',
  'Grooming & Care'
];

const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.products}`);
  return data;
};

const fetchSuppliers = async (): Promise<Supplier[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.suppliers}`);
  return data;
};

export default function Products() {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: products, isLoading, error } = useQuery('products', fetchProducts);
  const { data: suppliers } = useQuery('suppliers', fetchSuppliers);
  const { darkMode } = useTheme();

  // Apply filters and search
  const filteredProducts = products?.filter(product => {
    // Text search filter
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    // Supplier filter
    const matchesSupplier = selectedSuppliers.length === 0 || 
      selectedSuppliers.includes(product.supplierId);
    
    // Price filter
    const effectivePrice = product.discount ? product.price * (1 - product.discount) : product.price;
    const matchesMinPrice = !minPrice || effectivePrice >= parseFloat(minPrice);
    const matchesMaxPrice = !maxPrice || effectivePrice <= parseFloat(maxPrice);
    
    return matchesSearch && matchesCategory && matchesSupplier && matchesMinPrice && matchesMaxPrice;
  });

  // Apply sorting
  const sortedProducts = filteredProducts ? [...filteredProducts].sort((a, b) => {
    const priceA = a.discount ? a.price * (1 - a.discount) : a.price;
    const priceB = b.discount ? b.price * (1 - b.discount) : b.price;
    
    switch (sortOption) {
      case 'price_asc':
        return priceA - priceB;
      case 'price_desc':
        return priceB - priceA;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
        return b.productId - a.productId;
      default:
        return 0;
    }
  }) : [];

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedSuppliers([]);
    setMinPrice('');
    setMaxPrice('');
    setSortOption('');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedCategory || selectedSuppliers.length > 0 || 
    minPrice || maxPrice || searchTerm;

  const handleSupplierToggle = (supplierId: number) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId) 
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const handleQuantityChange = (productId: number, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change)
    }));
  };

  const handleAddToCart = (productId: number) => {
    const quantity = quantities[productId] || 0;
    if (quantity > 0) {
      // TODO: Implement cart functionality
      alert(`Added ${quantity} items to cart`);
      setQuantities(prev => ({
        ...prev,
        [productId]: 0
      }));
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center">Failed to fetch products</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>Products</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-800 text-light border-gray-700' : 'bg-white text-gray-800 border-gray-300'} rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors duration-300`}
              aria-label="Search products"
            />
            <svg 
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                !selectedCategory
                  ? 'bg-primary text-white'
                  : darkMode
                  ? 'bg-gray-800 text-light hover:bg-gray-700'
                  : 'bg-white text-gray-800 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : darkMode
                    ? 'bg-gray-800 text-light hover:bg-gray-700'
                    : 'bg-white text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Sidebar */}
            <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-lg transition-colors duration-300`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className={`font-medium mb-2 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    Price Range
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 text-light' : 'bg-gray-100 text-gray-800'} rounded transition-colors duration-300`}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 text-light' : 'bg-gray-100 text-gray-800'} rounded transition-colors duration-300`}
                    />
                  </div>
                </div>

                {/* Supplier Filter */}
                <div className="mb-6">
                  <h3 className={`font-medium mb-2 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    Suppliers
                  </h3>
                  <div className="space-y-2">
                    {suppliers?.map(supplier => (
                      <label key={supplier.supplierId} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSuppliers.includes(supplier.supplierId)}
                          onChange={() => handleSupplierToggle(supplier.supplierId)}
                          className="mr-2 w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className={`${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                          {supplier.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid Container */}
            <div className="flex-1">
              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`lg:hidden px-4 py-2 ${darkMode ? 'bg-gray-800 text-light' : 'bg-white text-gray-800'} rounded-lg transition-colors duration-300`}
                  >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                  <div className={`${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    Showing {sortedProducts?.length || 0} of {products?.length || 0} products
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-primary hover:text-accent transition-colors duration-300"
                    >
                      Clear All Filters
                    </button>
                  )}
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className={`px-4 py-2 ${darkMode ? 'bg-gray-800 text-light border-gray-700' : 'bg-white text-gray-800 border-gray-300'} rounded-lg border transition-colors duration-300`}
                  >
                    <option value="">Sort By</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name">Name</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Badges */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {searchTerm && (
                    <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-light' : 'bg-gray-200 text-gray-800'} flex items-center gap-2`}>
                      Search: "{searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="hover:text-primary">✕</button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-light' : 'bg-gray-200 text-gray-800'} flex items-center gap-2`}>
                      Category: {selectedCategory}
                      <button onClick={() => setSelectedCategory('')} className="hover:text-primary">✕</button>
                    </span>
                  )}
                  {minPrice && (
                    <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-light' : 'bg-gray-200 text-gray-800'} flex items-center gap-2`}>
                      Min: ${minPrice}
                      <button onClick={() => setMinPrice('')} className="hover:text-primary">✕</button>
                    </span>
                  )}
                  {maxPrice && (
                    <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-light' : 'bg-gray-200 text-gray-800'} flex items-center gap-2`}>
                      Max: ${maxPrice}
                      <button onClick={() => setMaxPrice('')} className="hover:text-primary">✕</button>
                    </span>
                  )}
                  {selectedSuppliers.map(supplierId => {
                    const supplier = suppliers?.find(s => s.supplierId === supplierId);
                    return supplier ? (
                      <span key={supplierId} className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-light' : 'bg-gray-200 text-gray-800'} flex items-center gap-2`}>
                        {supplier.name}
                        <button onClick={() => handleSupplierToggle(supplierId)} className="hover:text-primary">✕</button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts?.map(product => (
                  <div key={product.productId} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(118,184,82,0.3)] flex flex-col`}>
                    <div 
                      className={`relative h-56 ${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} transition-colors duration-300 cursor-pointer`}
                      onClick={() => handleProductClick(product)}
                    >
                      <img 
                        src={`/${product.imgName}`} 
                        alt={product.name}
                        className="w-full h-full object-contain p-2"
                      />
                      {product.discount && (
                        <div className="absolute top-8 left-0 bg-primary text-white px-3 py-1 -rotate-90 transform -translate-x-5 shadow-md">
                          {Math.round(product.discount * 100)}% OFF
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                          {product.category}
                        </span>
                      </div>
                      <h3 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2 transition-colors duration-300`}>{product.name}</h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 flex-grow transition-colors duration-300`}>{product.description}</p>
                      <div className="space-y-4 mt-auto">
                        <div className="flex justify-between items-center">
                          {product.discount ? (
                            <div>
                              <span className="text-gray-500 line-through text-sm mr-2">${product.price.toFixed(2)}</span>
                              <span className="text-primary text-xl font-bold">${(product.price * (1 - product.discount)).toFixed(2)}</span>
                            </div>
                          ) : (
                            <span className="text-primary text-xl font-bold">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1 transition-colors duration-300`}>
                            <button 
                              onClick={() => handleQuantityChange(product.productId, -1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300`}
                              aria-label={`Decrease quantity of ${product.name}`}
                              id={`decrease-qty-${product.productId}`}
                            >
                              <span aria-hidden="true">-</span>
                            </button>
                            <span 
                              className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center transition-colors duration-300`}
                              aria-label={`Quantity of ${product.name}`}
                              id={`qty-${product.productId}`}
                            >
                              {quantities[product.productId] || 0}
                            </span>
                            <button 
                              onClick={() => handleQuantityChange(product.productId, 1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300`}
                              aria-label={`Increase quantity of ${product.name}`}
                              id={`increase-qty-${product.productId}`}
                            >
                              <span aria-hidden="true">+</span>
                            </button>
                          </div>
                          <button 
                            onClick={() => handleAddToCart(product.productId)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              quantities[product.productId] 
                                ? 'bg-primary hover:bg-accent text-white' 
                                : `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} cursor-not-allowed`
                            }`}
                            disabled={!quantities[product.productId]}
                            aria-label={`Add ${quantities[product.productId] || 0} ${product.name} to cart`}
                            id={`add-to-cart-${product.productId}`}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div 
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl transition-colors duration-300`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={`${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} rounded-lg mb-6 p-4`}>
              <img 
                src={`/${selectedProduct.imgName}`} 
                alt={selectedProduct.name}
                className="w-full h-auto object-contain max-h-[400px]"
              />
            </div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
              {selectedProduct.name}
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg transition-colors duration-300`}>
              {selectedProduct.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}