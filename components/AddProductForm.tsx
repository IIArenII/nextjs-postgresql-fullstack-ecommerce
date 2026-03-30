"use client";

import { addProduct } from "@/app/seller/actions";
import { toast } from "sonner";
import { ProductImageInput } from "./ProductImageInput";
import { useRef } from "react";

export function AddProductForm({ categories }: { categories: string[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAddProduct(formData: FormData) {
    try {
      await addProduct(formData);
      toast.success("Product listed successfully!");
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <form
      ref={formRef}
      action={handleAddProduct}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex flex-col gap-4 max-w-xl"
    >
      <input
        name="name"
        placeholder="Product name"
        required
        className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="Price (e.g. 29.99)"
          required
          className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <input
          name="stock_num"
          type="number"
          step="1"
          min="0"
          placeholder="Stock"
          required
          className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <input
          name="discount_percent"
          type="number"
          step="1"
          min="0"
          max="100"
          placeholder="Discount %"
          className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <textarea
        name="description"
        placeholder="Description"
        rows={3}
        required
        className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      <div>
        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">
          Category
        </label>
        <select
          name="category"
          required
          defaultValue=""
          className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 bg-white cursor-pointer"
        >
          <option value="" disabled>Select a category...</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      <ProductImageInput />
      
      <button
        type="submit"
        className="bg-slate-900 text-white p-3 rounded-lg font-bold hover:bg-black transition-all dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        List Product
      </button>
    </form>
  );
}
