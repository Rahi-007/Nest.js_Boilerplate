import * as dotenv from "dotenv";
import { defineConfig } from "@mikro-orm/postgresql";
import { UserSchema } from "../auth/entity/user.entity";

dotenv.config();

export default defineConfig({
  clientUrl: process.env.DATABASE_URL,
  entities: [UserSchema],
  debug: false,
  allowGlobalContext: true,
  pool: {
    min: 2,
    max: 10,
  },
  seeder: {
    path: "./src/config",
    defaultSeeder: "Seed",
  },
  driverOptions: {
    connection: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
});
