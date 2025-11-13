import * as dotenv from "dotenv";
import { defineConfig } from "@mikro-orm/postgresql";
import { User } from "../auth/entites/user.entity";
import { Table } from "../auth/entites/base.entity";

dotenv.config();

export default defineConfig({
  clientUrl:
    process.env.DATABASE_URL ||
    "postgresql://postgres:root@localhost:5432/learn",
  entities: [User, Table],
  debug: false, // Disable debug logs
  allowGlobalContext: true,
  pool: {
    min: 2,
    max: 10,
  },
  seeder: {
    path: "./src/config", // Path to the seeder files
    defaultSeeder: "Seed", // Default seeder class name
  },
});
