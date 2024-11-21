export interface Product {
    id: string;
    title: string;
    description: string | null;
    price: number;
    condition: string;
    category: string;
    images: string[];
    specs: Record<string, any> | null;
    status: string;
    sellerId: string;
    createdAt: string;
    updatedAt: string;
    seller: {
      username: string;
      email: string;
    };
  }
  
  export interface ProductResponse {
    products: Product[];
    meta: {
      total: number;
      page: number;
      lastPage: number;
    };
  }