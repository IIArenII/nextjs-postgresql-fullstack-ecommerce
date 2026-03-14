-- Migration 004: Add discount_percent column to products
-- Allows sellers to apply a percentage discount (0-100) to any product.
-- The discounted price is calculated and rounded to the nearest whole number in the app.

ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_percent INTEGER NOT NULL DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100);
