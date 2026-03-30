import { MetadataRoute } from 'next'
import { sql } from '@/lib/db'
import { PRODUCT_CATEGORIES } from '@/lib/constants'

const BASE_URL = 'https://storefront-ecommerce.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all product IDs
  const products = await sql<{ id: number }[]>`SELECT id FROM products`
  
  const productEntries = products.map((p) => ({
    url: `${BASE_URL}/products/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const categoryEntries = PRODUCT_CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/categories/${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const routes = ['', '/products', '/categories'].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  return [...routes, ...categoryEntries, ...productEntries]
}
