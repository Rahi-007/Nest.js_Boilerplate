import { Controller, Post, Get, Put, Delete, Body, Param, HttpCode, HttpStatus, ParseIntPipe } from "@nestjs/common";
import { CustomJwtService } from "../config/jwt/jwt.service";
import { LoginDto, LoginResponseDto } from "./dto/logIn.dto";
import { AuthService } from "./auth.service";
import { CreateUserDto, UpdateUserDto, UserRes } from "./dto/user.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly jwtService: CustomJwtService,
    private readonly authService: AuthService
  ) { }

  /**
   * Login endpoint
   */
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    // Validate user credentials
    const user = await this.authService.validateUser(loginDto);
    
    // Create JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Generate access and refresh tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.generateToken(payload),
      this.jwtService.generateRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
      user: user as UserRes,
    };
  }

  /**
   * Get all users
   */
  @Get("users")
  async findAll(): Promise<UserRes[]> {
    try {
      const users = await this.authService.findAll();
      return users as UserRes[];
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user by ID
   */
  @Get("users/:id")
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserRes> {
    try {
      const user = await this.authService.findOne(id);
      return user as UserRes;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Register a new user
   */
  @Post("register")
  async register(@Body() createUserDto: CreateUserDto): Promise<UserRes> {
    try {
      const newUser = await this.authService.create(createUserDto);
      return newUser as UserRes;
    } catch (error) {
      throw new Error(`Failed to register user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing user
   */
  @Put("users/:id")
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserRes> {
    try {
      const updatedUser = await this.authService.update(id, updateUserDto);
      return updatedUser as UserRes;
    } catch (error) {
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a user
   */
  @Delete("users/:id")
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.authService.remove(id);
      return { message: `User with ID ${id} deleted successfully` };
    } catch (error) {
      throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
