import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

async function runMigration() {
  const { sql } = await import("../lib/db");
  
  try {
    console.log("Adding created_at to products...");
    await sql.unsafe("ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()");
    console.log("Migration 008 completed successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

runMigration();
