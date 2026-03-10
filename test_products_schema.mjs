import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'products';
    `;
    console.log("PRODUCTS COLUMNS:", columns);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
