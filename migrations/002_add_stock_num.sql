-- Migration 002: Add stock_num column to products
-- Tracks how many units of a product are available.

ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_num INTEGER NOT NULL DEFAULT 0;
