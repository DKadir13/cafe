import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Minus, Plus, X } from 'lucide-react';

export const TableView: React.FC = () => {
  const { tables } = useStore();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Masalar</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => (
                <div
                    key={table.id}
                    className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md"
                    onClick={() => setSelectedTable(table.id)}
                >
                  <h2 className="text-xl font-semibold">Masa {table.id}</h2>
                </div>
            ))}
          </div>
        </div>
        {selectedTable !== null && <TableDetail tableId={selectedTable} onClose={() => setSelectedTable(null)} />}
      </div>
  );
};

const TableDetail: React.FC<{ tableId: number; onClose: () => void }> = ({ tableId, onClose }) => {
  const { tables, products, addOrderToTable, updateOrderQuantity, removeOrderFromTable, resetTable } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const table = tables.find((t) => t.id === tableId);
  if (!table) return null;

  const handleAddOrder = () => {
    if (selectedProduct && quantity > 0) {
      addOrderToTable(tableId, selectedProduct, quantity);
      setSelectedProduct('');
      setQuantity(1);
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
          <button onClick={onClose} className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-4">Masa {tableId}</h2>
          <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
          >
            <option value="">Ürün Seç</option>
            {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ₺{product.price}
                </option>
            ))}
          </select>
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 bg-gray-100 rounded">
              <Minus className="w-4 h-4" />
            </button>
            <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border rounded"
            />
            <button onClick={() => setQuantity(quantity + 1)} className="p-2 bg-gray-100 rounded">
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={handleAddOrder} className="bg-blue-600 text-white px-4 py-2 rounded">
              Ürün Sayısı seç ve ekle
            </button>
          </div>
          <div>
            {table.orders.map((order, index) => {
              const product = products.find((p) => p.id === order.productId);
              return (
                  <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
                    <span>{product?.name}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateOrderQuantity(tableId, index, Math.max(1, order.quantity - 1))} className="p-1 bg-gray-200 rounded">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span>{order.quantity}</span>
                      <button onClick={() => updateOrderQuantity(tableId, index, order.quantity + 1)} className="p-1 bg-gray-200 rounded">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeOrderFromTable(tableId, index)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
              );
            })}
          </div>
          <button onClick={() => resetTable(tableId)} className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded">
            Masa Sıfırla
          </button>
        </div>
      </div>
  );
};
