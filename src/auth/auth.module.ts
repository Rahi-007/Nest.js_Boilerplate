import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { CustomJwtModule } from "../config/jwt/jwt.module";

@Module({
  imports: [CustomJwtModule],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}
