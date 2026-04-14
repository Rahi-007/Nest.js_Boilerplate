import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConfigurationService } from "./configuration";
import * as Joi from "joi";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local", ".env.production"],
      validationSchema: Joi.object({
        // Server
        PORT: Joi.number().default(8001),
        NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
        CORS_ORIGIN: Joi.string().default("http://localhost:3000"),

        // Database - either DATABASE_URL or individual variables
        DATABASE_URL: Joi.string().optional(),
        DB_HOST: Joi.string().default("localhost"),
        DB_PORT: Joi.number().default(5432),
        DB_NAME: Joi.string().default("nest_boilerplate"),
        DB_USER: Joi.string().default("postgres"),
        DB_PASSWORD: Joi.string().default(""),

        // JWT
        JWT_SECRET: Joi.string().required().messages({
          "any.required": "JWT_SECRET is required",
        }),
        JWT_EXPIRES_IN: Joi.string().default("1d"),
        JWT_REFRESH_SECRET: Joi.string().required().messages({
          "any.required": "JWT_REFRESH_SECRET is required",
        }),
        JWT_REFRESH_EXPIRES_IN: Joi.string().default("7d"),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [ConfigurationService],
  exports: [ConfigurationService, ConfigModule],
})
export class ConfigurationModule {}
