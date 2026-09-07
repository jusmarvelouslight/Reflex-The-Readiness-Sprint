import dotenv from "dotenv";
dotenv.config();

import { defineConfig } from "@prisma/config";

// Force a long timeout limit so remote Supabase calls don't drop out over high network latency
const migrationUrl = process.env.DATABASE_URL 
  ? `${process.env.DATABASE_URL}?connection_limit=1&socket_timeout=60&pool_timeout=60`
  : undefined;

export default defineConfig({
  datasource: {
    url: migrationUrl,
  },
  migrations: {
    seed: "tsx src/config/seed.ts",
  },
});
