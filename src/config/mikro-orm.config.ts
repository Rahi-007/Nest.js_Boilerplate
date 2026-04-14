import { defineConfig } from "@mikro-orm/postgresql";
import { UserSchema } from "../auth/entity/user.entity";
import { ConfigurationService } from "./configuration";

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
      ssl: true,
    },
  },
});

// Alternative factory-based configuration for MikroOrmModule.forRootAsync
export const mikroOrmConfigFactory = (configService: ConfigurationService) => {
  const dbConfig = configService.database;

  return defineConfig({
    clientUrl: dbConfig.url,
    host: dbConfig.host,
    port: dbConfig.port,
    dbName: dbConfig.name,
    user: dbConfig.user,
    password: dbConfig.password,
    entities: [UserSchema],
    debug: configService.isDevelopment,
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
};
