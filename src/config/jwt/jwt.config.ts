import { JwtModuleOptions } from "@nestjs/jwt";
import { StringValue } from "ms";
import { ConfigurationService } from "../configuration";

// Factory functions using ConfigurationService
export const jwtConfigFactory = (configService: ConfigurationService): JwtModuleOptions => ({
  secret: configService.jwt.secret,
  signOptions: {
    expiresIn: configService.jwt.expiresIn as StringValue,
  },
});

export const jwtRefreshConfigFactory = (configService: ConfigurationService): JwtModuleOptions => ({
  secret: configService.jwt.refreshSecret,
  signOptions: {
    expiresIn: configService.jwt.refreshExpiresIn as StringValue,
  },
});
