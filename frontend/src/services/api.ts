import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productApi = {
  // Get all products with optional filters
  getProducts: async (params?: {
    category?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData: {
    title: string;
    description?: string;
    price: number;
    condition: string;
    category: string;
    images: string[];
    specs?: Record<string, any>;
  }) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id: string, updateData: Partial<{
    title: string;
    description: string;
    price: number;
    condition: string;
    category: string;
    images: string[];
    specs: Record<string, any>;
    status: string;
  }>) => {
    const response = await api.put(`/products/${id}`, updateData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string) => {
    await api.delete(`/products/${id}`);
  },
};

export default api;