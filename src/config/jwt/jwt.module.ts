import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CustomJwtService } from "./jwt.service";
import { ConfigurationModule } from "../configuration.module";
import { jwtConfigFactory } from "./jwt.config";
import { ConfigurationService } from "../configuration";
import { JwtStrategy } from "./jwt.strategy";
import { JwtRefreshStrategy } from "./jwt-refresh.strategy";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      useFactory: jwtConfigFactory,
      inject: [ConfigurationService],
    }),
    ConfigurationModule,
  ],
  providers: [JwtStrategy, JwtRefreshStrategy, CustomJwtService],
  exports: [JwtModule, JwtStrategy, JwtRefreshStrategy, CustomJwtService],
})
export class CustomJwtModule {}
