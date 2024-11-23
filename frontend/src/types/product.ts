export interface Product {
    id: string;
    title: string;
    description: string | null;
    price: number;
    condition: string;
    quantity: number;
    category: string;
    images: string[];
    specs: Record<string, any> | null;
    status: string;
    sellerId: string;
    createdAt: string;
    updatedAt: string;
    sellerID: string;
    seller: {
      username: string;
      email: string;
    //   id: string;
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
  export interface CartItem {
    id: string;
    quantity: number;
    product: {
      id: string;
      title: string;
      price: number;
      quantity: number; 
      images: string[];
      condition: string;
      seller: {
        username: string;
      };
    };
  }