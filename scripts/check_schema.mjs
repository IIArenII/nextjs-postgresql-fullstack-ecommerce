import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    const cols = await sql`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'products'
        AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    console.log("PRODUCTS COLUMNS:");
    cols.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}${c.character_maximum_length ? `(${c.character_maximum_length})` : ''}`));
    
    const userCols = await sql`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'users'
        AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    console.log("\nUSERS COLUMNS:");
    userCols.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}${c.character_maximum_length ? `(${c.character_maximum_length})` : ''}`));
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
