import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Minus, Plus, X } from 'lucide-react';

export const TableView: React.FC = () => {
  const { tables, products, addOrderToTable, updateOrderQuantity, removeOrderFromTable, resetTable, addToDayEnd } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddOrder = (tableId: number) => {
    if (selectedProduct && quantity > 0) {
      addOrderToTable(tableId, selectedProduct, quantity);
      setSelectedProduct('');
      setQuantity(1);
    }
  };

  const handleResetTable = (tableId: number) => {
    const table = tables.find((t) => t.id === tableId);
    if (table && confirm('Are you sure you want to reset this table?')) {
      // Gün sonu verisine ekle
      addToDayEnd({
        tableId: table.id,
        items: table.orders,
        total: calculateTableTotal(table.orders),
      });
      resetTable(tableId);
    }
  };

  const calculateTableTotal = (orders: any[]) => {
    return orders.reduce((sum, order) => sum + order.price * order.quantity, 0);
  };

  const handleEndOfDay = () => {
    // Gün sonu verisi toplama işlemi
    const dayEndData = tables.map((table) => ({
      tableId: table.id,
      items: table.orders,
      total: calculateTableTotal(table.orders),
    }));
    addToDayEnd(dayEndData);  // Tüm masalardaki verileri Gün Sonu'na ekle
    alert('All data has been added to the day-end.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tables</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => (
            <div key={table.id} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Table {table.id}</h2>
              
              <div className="mb-4 space-y-2">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select item</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price}
                    </option>
                  ))}
                </select>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="border rounded px-3 py-2 w-20 text-center"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAddOrder(table.id)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add to Order
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {table.orders.map((order, index) => {
                  const product = products.find((p) => p.id === order.productId);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 bg-gray-50 p-2 rounded"
                    >
                      <div className="flex-1">
                        <span className="font-medium">{product?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateOrderQuantity(table.id, index, Math.max(1, order.quantity - 1))}
                          className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center">{order.quantity}</span>
                        <button
                          onClick={() => updateOrderQuantity(table.id, index, order.quantity + 1)}
                          className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <span className="w-20 text-right">
                          ${(order.quantity * order.price).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeOrderFromTable(table.id, index)}
                          className="p-1 rounded text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold">
                    ${calculateTableTotal(table.orders).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => handleResetTable(table.id)}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Reset Table
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={handleEndOfDay}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            End of Day
          </button>
        </div>
      </div>
    </div>
  );
};
