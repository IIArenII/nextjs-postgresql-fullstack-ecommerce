export const PRODUCT_CATEGORIES = [
  "Books",
  "Clothing & Apparel",
  "Electronics",
  "Food & Beverages",
  "Gaming",
  "Health & Beauty",
  "Home & Garden",
  "Jewelry",
  "Music & Instruments",
  "Office Supplies",
  "Pets",
  "Sports & Outdoors",
  "Toys & Games",
  "Vehicles & Parts",
  "Other",
] as const;

export type Category = (typeof PRODUCT_CATEGORIES)[number];

export const CATEGORY_IMAGES: Record<string, string> = {
  "Books": "/images/cat_books.webp",
  "Electronics": "/images/electronics_minimalist",
  "Home & Garden": "/images/cat_home.webp",
  "Home & Living": "/images/cat_home.webp",
  "Clothing & Apparel": "/images/cat_fashion.webp",
  "Fashion": "/images/cat_fashion.webp",
  "Sports & Outdoors": "/images/sports_minimalist",
  "Food & Beverages": "/images/cat_food_beverages.png",
  "Gaming": "/images/cat_gaming.png",
  "Health & Beauty": "/images/cat_health_beauty.png",
  "Jewelry": "/images/cat_jewelry.png",
  "Music & Instruments": "/images/cat_music_instruments.png",
  "Office Supplies": "/images/cat_office_supplies.png",
  "Pets": "/images/cat_pets.png",
  "Toys & Games": "/images/cat_toys_games.png",
  "Vehicles & Parts": "/images/cat_vehicles_parts.png",
  "Other": "/images/elevate_minimalits"
};
