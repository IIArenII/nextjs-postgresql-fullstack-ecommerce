"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { updateStock, updateProduct } from "@/app/seller/actions";
import { Edit2, X, Check } from "lucide-react";

export function ProductListing({ 
  product, 
  categories 
}: { 
  product: any, 
  categories: string[] 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);

  if (isEditing) {
    return (
      <div className="rounded-2xl border-2 border-blue-500 bg-white p-4 shadow-lg dark:bg-slate-900 dark:border-blue-600">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900 dark:text-white">Edit Product</h3>
          <button 
            onClick={() => setIsEditing(false)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <form 
          action={async (formData) => {
            setIsPending(true);
            try {
              await updateProduct(formData);
              setIsEditing(false);
            } catch (e: any) {
              alert(e.message);
            } finally {
              setIsPending(false);
            }
          }}
          className="flex flex-col gap-3"
        >
          <input type="hidden" name="productId" value={product.id} />
          
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Name</label>
            <input 
              name="name" 
              defaultValue={product.name} 
              required
              className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Price</label>
              <input 
                name="price" 
                type="number" 
                step="0.01"
                defaultValue={product.price} 
                required
                className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Category</label>
              <select 
                name="category" 
                defaultValue={product.category}
                className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Disc%</label>
              <input 
                name="discount_percent" 
                type="number" 
                step="1"
                min="0"
                max="100"
                defaultValue={product.discount_percent || 0} 
                className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Description</label>
            <textarea 
              name="description" 
              defaultValue={product.description} 
              rows={3}
              required
              className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {isPending ? "Saving..." : <><Check className="w-4 h-4" /> Save Changes</>}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative group">
      <ProductCard product={product} />
      
      {/* Quick Stock Edit */}
      <div className="mt-2 text-sm text-slate-500 flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <span className="font-semibold text-xs ml-1">Stock:</span>
        <form action={updateStock} className="flex gap-2">
          <input type="hidden" name="productId" value={product.id} />
          <input 
            type="number" 
            name="stock_num" 
            defaultValue={product.stock_num} 
            min="0" 
            className="w-16 p-1 text-center text-xs border rounded-md dark:bg-slate-800 dark:border-slate-700 font-bold text-slate-900 dark:text-white" 
          />
          <button type="submit" className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors">
            Update
          </button>
        </form>
      </div>

      {/* Edit Credentials Button */}
      <button 
        onClick={() => setIsEditing(true)}
        className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-slate-600 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all border border-slate-200 dark:bg-slate-800/90 dark:border-slate-700 dark:text-slate-400 dark:hover:text-blue-400"
        title="Edit product details"
      >
        <Edit2 className="w-4 h-4" />
      </button>
    </div>
  );
}
