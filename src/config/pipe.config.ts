import { ValidationPipe, BadRequestException, HttpStatus } from "@nestjs/common";
import { INestApplication } from "@nestjs/common";

/**
 * Configures global validation pipe with enhanced error messages.
 */
export function setupPipes(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: errors => {
        const formattedErrors = errors.map(error => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        }));
        return new BadRequestException({
          message: "Validation failed",
          errors: formattedErrors,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      },
    })
  );
}
