import { sql } from "@/lib/db";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string; // Optional, in case Mockaroo generated images
}

export default async function Home() {
  const products = await sql<Product[]>`
    SELECT id, name, description, price, category 
    FROM products 
    ORDER BY name ASC
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Storefront<span className="text-blue-600">.</span>
          </h1>
          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {products.length} Products Found
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Product Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h2>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {product.description}
                </p>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
