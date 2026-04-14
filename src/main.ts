import * as dotenv from "dotenv";
import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { TimeoutInterceptor } from "./common/interceptors/timeout.interceptor";
import { setupSecurity } from "./config/security.config";
import { setupCors } from "./config/cors.config";
import { setupPipes } from "./config/pipe.config";
import { setupSwagger } from "./config/swagger.config";

// Load environment variables
dotenv.config();

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  try {
    logger.log("🔄 Creating NestJS application...");
    const app = await NestFactory.create(AppModule, {
      logger: ["error", "warn", "log", "debug", "verbose"],
      bufferLogs: true,
    });

    // Apply security middleware (helmet, compression, cookie-parser)
    setupSecurity(app);

    // Configure CORS
    setupCors(app);

    // Global prefix
    app.setGlobalPrefix("api", {
      exclude: ["/health", "/api-docs", "/api-docs-json"],
    });

    // Global validation pipe
    setupPipes(app);

    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // Global interceptors
    app.useGlobalInterceptors(
      new TransformInterceptor(),
      new TimeoutInterceptor(10000) // 10 second timeout
    );

    // Swagger documentation
    setupSwagger(app);

    const port = process.env.PORT || 8001;
    await app.listen(port);

    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    logger.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
    logger.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);

    // Log CORS origins
    const corsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map(origin => origin.trim()) : ["http://localhost:3000"];
    logger.log(`🔒 CORS Origins: ${corsOrigins.join(", ")}`);
  } catch (error) {
    logger.error("❌ Failed to start application:", error);
    process.exit(1);
  }
}

bootstrap().catch(error => {
  console.error("❌ Application failed to start:", error);
  process.exit(1);
});
