import React from 'react';
import { useStore } from '../store/useStore';
import { Printer, X } from 'lucide-react';

export const DayEndReport: React.FC = () => {
  const { currentDayEnd, products, printDayEnd, clearDayEnd } = useStore();

  if (!currentDayEnd) return null;

  const getProductDetails = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  const handlePrint = () => {
    window.print();
    printDayEnd();  // Gün sonu raporunu yazdırırken güncel durumu sıfırlar
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 print:p-0 print:bg-white print:inset-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 print:shadow-none">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h2 className="text-2xl font-bold">Day End Report</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={clearDayEnd}
              className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>
        </div>

        <div className="print:text-black">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Café Manager</h1>
            <p className="text-gray-600">Daily Sales Report</p>
            <p className="text-gray-600">{new Date(currentDayEnd.date).toLocaleDateString()}</p>
          </div>

          <div className="space-y-6">
            {currentDayEnd.orders.map((tableOrder) => (
              tableOrder.items.length > 0 && (
                <div key={tableOrder.tableId} className="border-b pb-4">
                  <h3 className="font-semibold mb-2">Table {tableOrder.tableId}</h3>
                  <div className="space-y-2">
                    {tableOrder.items.map((item, index) => {
                      const product = getProductDetails(item.productId);
                      return (
                        <div key={index} className="flex justify-between">
                          <span>{product?.name}</span>
                          <span className="text-right">
                            {item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between font-semibold">
                      <span>Table Total:</span>
                      <span>${tableOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>

          <div className="mt-8 pt-4 border-t">
            <div className="flex justify-between text-xl font-bold">
              <span>Total Sales:</span>
              <span>${currentDayEnd.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
