-- Migration 003: Alter category column to support longer values
-- The original VARCHAR(7) was too short for category names like "Electronics".

ALTER TABLE products ALTER COLUMN category TYPE TEXT;
