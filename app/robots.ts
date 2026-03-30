import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/account/', '/seller/', '/bag/', '/favorites/', '/orders/'],
    },
    sitemap: 'https://storefront-ecommerce.vercel.app/sitemap.xml',
  }
}
