import { INestApplication } from "@nestjs/common";

/**
 * Configures CORS for the NestJS application.
 * Reads allowed origins from environment variable CORS_ORIGIN (comma-separated)
 * or defaults to http://localhost:3000.
 */
export function setupCors(app: INestApplication): void {
  const corsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map(origin => origin.trim()) : ["http://localhost:3000"];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
    ],
  });
}
