import "dotenv/config";

import { defineConfig } from "@prisma/config";

const databaseUrl =
  process.env.DATABASE_URL;

let migrationUrl: string | undefined;

if (databaseUrl) {
  const url = new URL(
    databaseUrl
  );

  url.searchParams.set(
    "connection_limit",
    "1"
  );

  url.searchParams.set(
    "socket_timeout",
    "30"
  );

  migrationUrl =
    url.toString();
}

export default defineConfig({
  datasource: {
    url: migrationUrl,
  },
});