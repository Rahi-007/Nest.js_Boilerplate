import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface DatabaseConfig {
  url?: string;
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface AppConfig {
  port: number;
  environment: string;
  corsOrigin: string[];
  nodeEnv: string;
}

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  get app(): AppConfig {
    const corsOrigin = this.configService.get<string>("CORS_ORIGIN");
    return {
      port: this.configService.get<number>("PORT", 8001),
      environment: this.configService.get<string>("NODE_ENV", "development"),
      corsOrigin: corsOrigin ? corsOrigin.split(",").map(origin => origin.trim()) : ["http://localhost:3000"],
      nodeEnv: this.configService.get<string>("NODE_ENV", "development"),
    };
  }

  get database(): DatabaseConfig {
    const databaseUrl = this.configService.get<string>("DATABASE_URL");

    if (databaseUrl) {
      // Parse DATABASE_URL if provided
      const url = new URL(databaseUrl);
      return {
        url: databaseUrl,
        host: url.hostname,
        port: parseInt(url.port, 10) || 5432,
        name: url.pathname.replace("/", ""),
        user: url.username,
        password: url.password,
      };
    }

    // Fallback to individual environment variables
    return {
      host: this.configService.get<string>("DB_HOST", "localhost"),
      port: this.configService.get<number>("DB_PORT", 5432),
      name: this.configService.get<string>("DB_NAME", "nest_boilerplate"),
      user: this.configService.get<string>("DB_USER", "postgres"),
      password: this.configService.get<string>("DB_PASSWORD", ""),
    };
  }

  get jwt(): JwtConfig {
    return {
      secret: this.configService.get<string>("JWT_SECRET", "default_jwt_secret_key_change_in_production"),
      expiresIn: this.configService.get<string>("JWT_EXPIRES_IN", "1d"),
      refreshSecret: this.configService.get<string>("JWT_REFRESH_SECRET", "default_refresh_secret_key_change_in_production"),
      refreshExpiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRES_IN", "7d"),
    };
  }

  get isDevelopment(): boolean {
    return this.app.environment === "development";
  }

  get isProduction(): boolean {
    return this.app.environment === "production";
  }

  get isTest(): boolean {
    return this.app.environment === "test";
  }
}
