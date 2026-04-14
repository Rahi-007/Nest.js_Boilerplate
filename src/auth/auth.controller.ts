import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  InternalServerErrorException,
  UseGuards,
  Request,
} from "@nestjs/common";
import { CustomJwtService } from "../config/jwt/jwt.service";
import { LoginDto, LoginResponseDto } from "./dto/logIn.dto";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { CreateUserDto, UserRes } from "./dto/user.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { IUser } from "./entity/user.entity";
import { buildUserResponse } from "../utils/user-response.util";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly jwtService: CustomJwtService,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  // Login endpoint
  @Post("login")
  @ApiOperation({ summary: "User login" })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const user = await this.authService.validateUser(loginDto);

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const [accessToken, refreshToken] = await Promise.all([this.jwtService.generateToken(payload), this.jwtService.generateRefreshToken(payload)]);

      const userRes = buildUserResponse(user);

      return {
        accessToken,
        refreshToken,
        user: userRes,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException("Something went wrong");
    }
  }

  /**
   * Register a new user
   */
  @Post("register")
  @ApiOperation({ summary: "Register user and auto login" })
  @ApiResponse({
    status: 200,
    description: "Registration successful and auto login completed",
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 409, description: "Email or phone already exists" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async register(@Body() createUserDto: CreateUserDto): Promise<LoginResponseDto> {
    try {
      const newUser = await this.authService.create(createUserDto);
      const loggedInUser = await this.authService.updateLastLoggedIn(newUser);

      const payload = {
        sub: loggedInUser.id,
        email: loggedInUser.email,
        role: loggedInUser.role,
      };

      const [accessToken, refreshToken] = await Promise.all([this.jwtService.generateToken(payload), this.jwtService.generateRefreshToken(payload)]);

      return {
        accessToken,
        refreshToken,
        user: buildUserResponse(loggedInUser),
      };
    } catch (error) {
      throw new Error(`Failed to register user: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Get current user profile
   */
  @Get("profile")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: 200,
    description: "Profile retrieved successfully",
    type: UserRes,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized (invalid or missing token)",
  })
  async getProfile(@Request() req: { user?: { sub?: number } }): Promise<UserRes> {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new UnauthorizedException("Invalid token");
      }
      const user = await this.userService.findOne(userId);
      return buildUserResponse(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to fetch profile");
    }
  }

  /**
   * Logout user (client-side token invalidation)
   */
  @Post("logout")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Logout user (client-side)" })
  @ApiResponse({ status: 200, description: "Logout successful" })
  @ApiResponse({
    status: 401,
    description: "Unauthorized (invalid or missing token)",
  })
  @HttpCode(HttpStatus.OK)
  async logout(): Promise<{ message: string }> {
    return {
      message: "Logout successful. Please remove tokens on client side.",
    };
  }

  /**
   * Refresh access token
   */
  @Post("refresh")
  @ApiOperation({ summary: "Refresh access token using refresh token" })
  @ApiResponse({
    status: 200,
    description: "Token refreshed successfully",
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: "Invalid refresh token" })
  async refresh(@Body() body: { refreshToken: string }): Promise<LoginResponseDto> {
    try {
      const payload = await this.jwtService.validateToken(body.refreshToken);
      if (!payload) {
        throw new UnauthorizedException("Invalid refresh token");
      }
      const user = await this.userService.findOne(payload.sub);

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.generateToken(newPayload),
        this.jwtService.generateRefreshToken(newPayload),
      ]);

      return {
        accessToken,
        refreshToken,
        user: buildUserResponse(user),
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
