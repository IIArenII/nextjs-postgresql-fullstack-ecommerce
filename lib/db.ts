import postgres from "postgres";

// Use the connection string from your .env.local
const connectionString = process.env.DATABASE_URL!;

// This setup prevents creating a new connection every time
// Next.js hot-reloads during development.
const globalForDb = global as unknown as {
  conn: ReturnType<typeof postgres> | undefined;
};

export const sql = globalForDb.conn ?? postgres(connectionString);

if (process.env.NODE_ENV !== "production") globalForDb.conn = sql;
