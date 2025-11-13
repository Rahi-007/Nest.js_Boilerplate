import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { CustomJwtService } from "../config/jwt/jwt.service";
import { LoginDto } from "./dto/logIn.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly jwtService: CustomJwtService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    // Simple validation - in a real app, you'd check against a database
    if (loginDto.email && loginDto.password) {
      const payload = {
        sub: 1,
        email: loginDto.email,
        role: "user",
      };

      const accessToken = await this.jwtService.generateToken(payload);

      return {
        accessToken,
        user: {
          id: 1,
          email: loginDto.email,
        },
      };
    }

    return { error: "Invalid credentials" };
  }
}
