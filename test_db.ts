import { sql } from "./lib/db";

async function run() {
  try {
    const enumTypes = await sql`
      SELECT e.enumlabel
      FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'user_role';
    `;
    console.log(enumTypes);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
