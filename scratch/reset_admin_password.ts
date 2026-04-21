import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

async function resetPassword() {
  const { sql } = await import("../lib/db");
  const email = "aerenevli@gmail.com";
  const newPassword = "tempPassword123!";
  
  try {
    console.log(`Resetting password for ${email}...`);
    const hash = await bcrypt.hash(newPassword, 10);
    
    await sql`
      UPDATE users 
      SET password_hash = ${hash} 
      WHERE email = ${email}
    `;
    
    console.log("------------------------------------------");
    console.log("PASSWORD RESET SUCCESSFUL");
    console.log(`Email: ${email}`);
    console.log(`New Temporary Password: ${newPassword}`);
    console.log("------------------------------------------");
    console.log("Please log in and change your password as soon as possible.");
  } catch (err) {
    console.error("Failed to reset password:", err);
  } finally {
    process.exit(0);
  }
}

resetPassword();
