import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Settings, PlusCircle, Image as ImageIcon } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { products, addProduct, removeProduct, setTableCount, endDay } = useStore();
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: '',
    description: '',
    image: '',
  });
  const [tableCount, setTableCountLocal] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      id: Date.now().toString(),
      ...newProduct,
    });
    setNewProduct({ name: '', price: 0, category: '', description: '', image: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEndDay = () => {
    if (confirm('Are you sure you want to end the day?')) {
      endDay();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">YÖNETİM PANELİ</h1>
          <button
            onClick={handleEndDay}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Gün sonu al
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Masa Ekle</h2>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={tableCount}
              onChange={(e) => setTableCountLocal(parseInt(e.target.value))}
              className="border rounded px-3 py-2 w-24"
              min="1"
            />
            <button
              onClick={() => setTableCount(tableCount)}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              Masa Numarası Seç ve Ekle
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircle className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Ürün Ekle</h2>
          </div>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Ürün Adı"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: parseFloat(e.target.value),
                  })
                }
                className="border rounded px-3 py-2"
                required
                step="0.01"
              />
              <input
                type="text"
                placeholder="Ürün Kategorisi"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Açıklama"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />
              <div className="col-span-2">
                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-4 rounded border-2 border-dashed">
                  <ImageIcon className="w-5 h-5" />
                  <span>Ürün İçin Örnek Resim Gir</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </label>
                {newProduct.image && (
                  <div className="mt-2">
                    <img
                      src={newProduct.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Ürünü Ekle
            </button>
          </form>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Eklenmiş Ürünler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-600">${product.price}</p>
                </div>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};