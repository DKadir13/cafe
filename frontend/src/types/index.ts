export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    image?: string;
  }
  
  export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
  }
  
  export interface Table {
    id: number;
    orders: OrderItem[];
  }
  
  export interface DailySales {
    id: string;
    date: string;
    total: number;
    orders: {
      tableId: number;
      items: OrderItem[];
      total: number;
    }[];
    printed: boolean;
  }
  
  export interface DayEndReport {
    sales: DailySales;
    products: Product[];
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    login: (username: string, password: string) => boolean;
    logout: () => void;
  }