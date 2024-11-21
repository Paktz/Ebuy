import { useState, useEffect } from 'react';
import { productApi } from '../../services/api';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  condition: string;
  category: string;
  images: string[];
  status: string;
  seller: {
    username: string;
  };
}

interface ProductResponse {
  products: Product[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });

  const fetchProducts = async (newPage = 1) => {
    try {
      setLoading(true);
      const response = await productApi.getProducts({
        page: newPage,
        limit: 12,
        ...filters,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      }) as ProductResponse;
      
      if (newPage === 1) {
        setProducts(response.products);
      } else {
        setProducts(prev => [...prev, ...response.products]);
      }
      
      setHasMore(response.meta.page < response.meta.lastPage);
      setPage(newPage);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />

        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Complete PC">Complete PC</option>
          <option value="Graphics Card">Graphics Card</option>
          <option value="Processor">Processor</option>
          <option value="Motherboard">Motherboard</option>
          <option value="Memory">Memory</option>
          <option value="Storage">Storage</option>
        </select>

        <select
          value={filters.condition}
          onChange={(e) => handleFilterChange('condition', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Conditions</option>
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Used">Used</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading && page === 1
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                <div className="p-4 bg-white border-x border-b rounded-b-lg space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchProducts(page + 1)}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;