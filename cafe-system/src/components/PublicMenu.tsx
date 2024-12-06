import React from 'react';
import { useStore } from '../store/useStore';

export const PublicMenu: React.FC = () => {
  const products = useStore((state) => state.products);
  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Ürünlerimiz</h1>
        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products
                .filter((product) => product.category === category)
                .map((product) => (
                  <div
                    key={product.id}
                    className="bg-white p-4 rounded-lg shadow-sm flex gap-4"
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-medium">{product.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {product.description}
                      </p>
                      <p className="text-gray-900 font-medium mt-2">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};