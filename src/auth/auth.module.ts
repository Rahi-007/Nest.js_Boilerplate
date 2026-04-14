import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { CustomJwtModule } from "../config/jwt/jwt.module";
import { AuthService } from "./auth.service";
import { RolesGuard } from "./guards/roles.guard";
import { UserModule } from "../user/user.module";

@Module({
  imports: [CustomJwtModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard],
  exports: [],
})
export class AuthModule {}
