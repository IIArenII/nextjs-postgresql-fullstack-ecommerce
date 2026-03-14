import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Please provide DATABASE_URL in the environment.");
  process.exit(1);
}

const sql = postgres(connectionString);

async function clearUsers() {
  try {
    console.log("Emptying verification_tokens table...");
    await sql`DELETE FROM verification_tokens`;

    // Because orders reference users via foreign key,
    // we need to delete orders first.
    console.log("Emptying orders table...");
    await sql`DELETE FROM orders`;

    console.log("Emptying users table...");
    await sql`DELETE FROM users`;

    console.log("Deleting products without a seller...");
    await sql`DELETE FROM products WHERE seller_id IS NULL`;

    console.log("Successfully deleted all accounts and related records!");
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await sql.end();
  }
}

clearUsers();
