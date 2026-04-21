import { sql } from "../lib/db";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

async function checkCols() {
  const { sql } = await import("../lib/db");
  const cols = await sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'products'
  `;
  console.log("COLUMNS IN PRODUCTS:", cols.map(c => c.column_name));
  process.exit(0);
}

checkCols();
