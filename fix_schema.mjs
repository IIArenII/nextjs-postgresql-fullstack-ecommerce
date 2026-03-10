import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    // 1. First, create a sequence for existing table ids so it doesn't conflict
    await sql`
      CREATE SEQUENCE IF NOT EXISTS products_id_seq;
    `;
    
    // 2. See max id
    const result = await sql`SELECT MAX(id) as max_id FROM products;`;
    const maxId = result[0].max_id || 0;
    
    // 3. Set sequence to max_id + 1
    await sql`SELECT setval('products_id_seq', ${maxId + 1}, false);`;

    // 4. Alter the column to use the sequence by default
    await sql`
      ALTER TABLE products
      ALTER COLUMN id SET DEFAULT nextval('products_id_seq');
    `;
    console.log("SUCCESS! Altered products schema to use auto-incrementing IDs");
  } catch(e) {
    console.error("Error migrating:", e);
  } finally {
    process.exit(0);
  }
}
run();
