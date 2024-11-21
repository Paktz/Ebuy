import { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Skeleton,
  Text,
  Center,
  Button,
  Stack,
  Select,
  Input,
  HStack,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
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
      <Center p={8}>
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  return (
    <Box maxW="7xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      {/* Filters */}
      <Stack spacing={4} mb={8} direction={{ base: 'column', md: 'row' }}>
        <Input
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <Select
          placeholder="Category"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="Complete PC">Complete PC</option>
          <option value="Graphics Card">Graphics Card</option>
          <option value="Processor">Processor</option>
          <option value="Motherboard">Motherboard</option>
          <option value="Memory">Memory</option>
          <option value="Storage">Storage</option>
        </Select>
        <Select
          placeholder="Condition"
          value={filters.condition}
          onChange={(e) => handleFilterChange('condition', e.target.value)}
        >
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Used">Used</option>
        </Select>
        <HStack>
          <NumberInput min={0}>
            <NumberInputField
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
          </NumberInput>
          <NumberInput min={0}>
            <NumberInputField
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </NumberInput>
        </HStack>
      </Stack>

      {/* Products Grid */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {loading && page === 1
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} height="400px" borderRadius="lg" />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </SimpleGrid>

      {/* Load More Button */}
      {hasMore && !loading && (
        <Center mt={8}>
          <Button
            colorScheme="blue"
            onClick={() => fetchProducts(page + 1)}
            isLoading={loading}
          >
            Load More
          </Button>
        </Center>
      )}
    </Box>
  );
};

export default ProductList;