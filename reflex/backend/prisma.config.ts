import dotenv from "dotenv";
dotenv.config();

import { defineConfig } from "@prisma/config";

// Append connection parameters to prevent transaction limits
const migrationUrl = process.env.DATABASE_URL 
  ? `${process.env.DATABASE_URL}?connection_limit=1&socket_timeout=30`
  : undefined;

export default defineConfig({
  datasource: {
    url: migrationUrl,
  },
});
