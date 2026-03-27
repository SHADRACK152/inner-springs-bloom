import { spawn, spawnSync } from "node:child_process";
import "dotenv/config";

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const databaseUrl = process.env.DATABASE_URL || "";
const useNeon = /neon\.tech/i.test(databaseUrl);

if (useNeon) {
  console.log("[app:start] Neon DATABASE_URL detected. Skipping local Docker PostgreSQL startup.");
} else {
  console.log("[app:start] Attempting to start local PostgreSQL via Docker Compose...");
  const db = spawnSync("docker", ["compose", "up", "-d", "db"], {
    stdio: "inherit",
    shell: false,
  });

  if (db.status !== 0) {
    console.warn(
      "[app:start] Could not start Docker DB. If Docker is not running, start your local PostgreSQL service and keep DATABASE_URL in .env valid.",
    );
  }
}

console.log("[app:start] Starting API and frontend...");
const child = spawn(npmCmd, ["run", "dev:full"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
