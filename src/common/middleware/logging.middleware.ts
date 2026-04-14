import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HTTP");

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, headers } = request;
    const userAgent = headers["user-agent"] || "";
    const startTime = Date.now();

    // Log incoming request
    this.logger.log(`📥 ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`);

    // Capture response finish event
    response.on("finish", () => {
      const { statusCode, statusMessage } = response;
      const duration = Date.now() - startTime;
      const contentLength = response.get("content-length") || 0;

      // Determine log level based on status code
      if (statusCode >= 400 && statusCode < 500) {
        this.logger.warn(`⚠️ ${method} ${originalUrl} ${statusCode} ${statusMessage} - ${duration}ms - ${contentLength}b`);
      } else if (statusCode >= 500) {
        this.logger.error(`❌ ${method} ${originalUrl} ${statusCode} ${statusMessage} - ${duration}ms - ${contentLength}b`);
      } else {
        this.logger.log(`📤 ${method} ${originalUrl} ${statusCode} ${statusMessage} - ${duration}ms - ${contentLength}b`);
      }
    });

    next();
  }
}
