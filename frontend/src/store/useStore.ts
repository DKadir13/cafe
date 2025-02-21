import { create } from 'zustand';
import { Product, Table, DailySales } from '../types';

interface CafeStore {
  products: Product[];
  tables: Table[];
  tableCount: number;
  dailySales: DailySales[];
  currentDayEnd: DailySales | null;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  setTableCount: (count: number) => void;
  addOrderToTable: (tableId: number, productId: string, quantity: number) => void;
  updateOrderQuantity: (tableId: number, orderIndex: number, quantity: number) => void;
  removeOrderFromTable: (tableId: number, orderIndex: number) => void;
  resetTable: (tableId: number) => void;
  endDay: () => void;
  printDayEnd: () => void;
  clearDayEnd: () => void;
  addToDayEnd: (order: { tableId: number; items: any[]; total: number }) => void;
  resetDayEnd: () => void;  // Gün sonunu sıfırlama fonksiyonu
}

export const useStore = create<CafeStore>((set) => ({
  products: [],
  tables: [],
  tableCount: 0,
  dailySales: [],
  currentDayEnd: null,

  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),

  setTableCount: (count) =>
    set(() => ({
      tableCount: count,
      tables: Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        orders: [],
      })),
    })),

  addOrderToTable: (tableId, productId, quantity) =>
    set((state) => {
      const product = state.products.find((p) => p.id === productId);
      if (!product) return state;

      return {
        tables: state.tables.map((table) =>
          table.id === tableId
            ? {
                ...table,
                orders: [...table.orders, { productId, quantity, price: product.price }],
              }
            : table
        ),
      };
    }),

  updateOrderQuantity: (tableId, orderIndex, quantity) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              orders: table.orders.map((order, index) =>
                index === orderIndex ? { ...order, quantity } : order
              ),
            }
          : table
      ),
    })),

  removeOrderFromTable: (tableId, orderIndex) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              orders: table.orders.filter((_, index) => index !== orderIndex),
            }
          : table
      ),
    })),

  resetTable: (tableId) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === tableId ? { ...table, orders: [] } : table
      ),
    })),

  endDay: () =>
    set((state) => {
      const today = new Date().toISOString().split('T')[0];
      const dailySale: DailySales = {
        id: Date.now().toString(),
        date: today,
        total: state.tables.reduce(
          (acc, table) =>
            acc +
            table.orders.reduce((sum, order) => sum + order.price * order.quantity, 0),
          0
        ),
        orders: state.tables.map((table) => ({
          tableId: table.id,
          items: table.orders,
          total: table.orders.reduce(
            (sum, order) => sum + order.price * order.quantity,
            0
          ),
        })),
        printed: false,
      };

      return {
        currentDayEnd: dailySale,
      };
    }),

  printDayEnd: () =>
    set((state) => {
      if (!state.currentDayEnd) return state;
      return {
        dailySales: [...state.dailySales, { ...state.currentDayEnd, printed: true }],
        tables: state.tables.map((table) => ({ ...table, orders: [] })),
        currentDayEnd: null,
      };
    }),

  clearDayEnd: () =>
    set({ currentDayEnd: null }),

  addToDayEnd: (order) =>
    set((state) => {
      // Add the new order to the currentDayEnd if it exists
      if (state.currentDayEnd) {
        const updatedOrders = [
          ...state.currentDayEnd.orders,
          { tableId: order.tableId, items: order.items, total: order.total },
        ];
        const updatedTotal = state.currentDayEnd.total + order.total;
        
        return {
          currentDayEnd: {
            ...state.currentDayEnd,
            orders: updatedOrders,
            total: updatedTotal,
          },
        };
      }
      return state;
    }),

  resetDayEnd: () =>
    set({ dailySales: [], currentDayEnd: null }), // Gün sonunu sıfırlama fonksiyonu
}));
