import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { CustomJwtModule } from "../config/jwt/jwt.module";
import { AuthService } from "./auth.service";

@Module({
  imports: [CustomJwtModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
