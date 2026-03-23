import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    const file = path.join(process.cwd(), 'migrations', '006_add_product_image.sql');
    const content = fs.readFileSync(file, 'utf8');
    await sql.unsafe(content);
    console.log("Migration 006_add_product_image.sql executed successfully.");
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
