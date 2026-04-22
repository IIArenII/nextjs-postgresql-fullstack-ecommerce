import "dotenv/config";
import postgres from "postgres";
import fs from "fs";
import path from "path";

const sql = postgres(process.env.DATABASE_URL!);

async function run() {
  const migrationPath = path.join(__dirname, "..", "migrations", "009_enable_rls.sql");
  const migration = fs.readFileSync(migrationPath, "utf-8");
  
  console.log("🔒 Enabling Row Level Security on all tables...\n");
  
  await sql.unsafe(migration);
  
  console.log("✅ RLS enabled on all tables:");
  console.log("   - products");
  console.log("   - users");
  console.log("   - orders");
  console.log("   - verification_tokens");
  console.log("   - favorite_products");
  console.log("\n🛡️  PostgREST (anon key) access is now fully blocked.");
  console.log("   Server-side SQL connections are unaffected.\n");
  
  await sql.end();
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
