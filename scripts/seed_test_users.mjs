/**
 * scripts/seed_test_users.mjs
 *
 * This script creates (or refreshes) two dedicated test accounts
 * used by Playwright E2E tests, so you never have to use real accounts in tests.
 *
 * HOW TO USE:
 *   1. Fill in your own email/password credentials below.
 *   2. Run: node --env-file=.env.local scripts/seed_test_users.mjs
 */

import postgres from "postgres";
import bcrypt from "bcrypt";

// ─────────────────────────────────────────────
//  FILL IN YOUR TEST CREDENTIALS HERE
// ─────────────────────────────────────────────
const TEST_BUYER = {
  name: "Eren",
  email: "evlieren4@gmail.com", 
  password: "Eren123*",       
  role: "Buyer",
};

const TEST_SELLER = {
  name: "Eren",
  email: "aerenevli@gmail.com", 
  password: "Eren123*",        
  role: "Seller",
};
// ─────────────────────────────────────────────

const sql = postgres(process.env.DATABASE_URL);

async function upsertUser({ name, email, password, role }) {
  const hash = await bcrypt.hash(password, 10);

  const [existing] = await sql`SELECT id FROM users WHERE email = ${email}`;

  if (existing) {
    await sql`
      UPDATE users
      SET name = ${name}, password_hash = ${hash}, role = ${role}, email_verified = TRUE
      WHERE email = ${email}
    `;
    console.log(`✅ Updated existing user: ${email} (${role})`);
  } else {
    await sql`
      INSERT INTO users (name, email, password_hash, role, email_verified)
      VALUES (${name}, ${email}, ${hash}, ${role}, TRUE)
    `;
    console.log(`✅ Created new user: ${email} (${role})`);
  }
}

async function run() {
  try {
    console.log("🌱 Seeding test users...\n");
    await upsertUser(TEST_BUYER);
    await upsertUser(TEST_SELLER);
    console.log("\n✨ Done! Your test accounts are ready.");
    console.log("   Make sure these same credentials are in your playwright.config.ts or a .env.test file.");
  } catch (err) {
    console.error("❌ Error seeding test users:", err.message);
  } finally {
    await sql.end();
  }
}

run();
