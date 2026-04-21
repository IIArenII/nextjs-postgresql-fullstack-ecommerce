-- Migration 007: Add Admin role and Product status
-- Step 1: Update user roles (assuming user_role is an ENUM)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'Admin';

-- Assign Admin role to the specific user
UPDATE users SET role = 'Admin' WHERE email = 'aerenevli@gmail.com';

-- Step 2: Add status to products
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_status') THEN
        CREATE TYPE product_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END$$;

-- Add status column
ALTER TABLE products ADD COLUMN IF NOT EXISTS status product_status DEFAULT 'pending';

-- Set existing products to approved to maintain current site state
UPDATE products SET status = 'approved' WHERE status = 'pending';
