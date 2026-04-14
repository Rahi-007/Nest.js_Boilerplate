import { INestApplication } from "@nestjs/common";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
// import { LoggingMiddleware } from "../common/middleware/logging.middleware";

/**
 * Applies security-related middleware to the NestJS application.
 * Includes Helmet for HTTP headers, compression for response size,
 * and cookie parser for handling cookies.
 */
export function setupSecurity(app: INestApplication): void {
  // Security headers
  app.use(helmet());

  // Response compression
  app.use(compression());

  // Cookie parsing
  app.use(cookieParser());

  // Optionally, you can add request logging middleware here
  //   const loggingMiddleware = new LoggingMiddleware();
  //   app.use(loggingMiddleware.use.bind(loggingMiddleware));
}
