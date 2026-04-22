-- ============================================================
-- Migration 009: Enable Row Level Security (RLS) on all tables
-- ============================================================
-- WHY: Supabase exposes tables via PostgREST using the anon key.
-- Without RLS, anyone with the anon key can read/write all data.
-- Our app uses direct postgres connections (DATABASE_URL) for all
-- data access, so we enable RLS and add NO permissive policies,
-- effectively blocking all PostgREST/anon access to these tables.
-- Direct SQL connections (used by our server actions) are not 
-- affected by RLS when using a superuser/service role.
-- ============================================================

-- 1. Products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. Orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. Verification tokens table
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- 5. Favorite products table
ALTER TABLE favorite_products ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- No permissive policies are added intentionally.
-- With RLS enabled and no policies, PostgREST (anon key) access
-- is fully blocked. Our server actions use the direct postgres
-- connection which bypasses RLS.
-- ============================================================
