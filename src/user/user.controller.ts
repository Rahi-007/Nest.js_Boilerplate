import {
  Get,
  Put,
  Body,
  Delete,
  Param,
  HttpCode,
  Controller,
  HttpStatus,
  ParseIntPipe,
  InternalServerErrorException,
  ForbiddenException,
  HttpException,
  UseGuards,
  Request,
} from "@nestjs/common";
import { Role } from "../utils/enums";
import { UserService } from "./user.service";
import { UpdateUserDto, UserRes } from "../auth/dto/user.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { IUser } from "../auth/entity/user.entity";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({
    status: 200,
    description: "Users retrieved successfully",
    type: UserRes,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized (invalid or missing token)",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden (admin access required)",
  })
  @ApiResponse({ status: 500, description: "Internal server error" })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<UserRes[]> {
    try {
      const users = await this.userService.findAll();
      return users.map((user) => this.buildUserResponse(user));
    } catch (error) {
      console.error("Fetch Users Error:", error);

      throw new InternalServerErrorException("Failed to fetch users");
    }
  }

  /**
   * Get user by ID
   */
  @ApiOperation({ summary: "Get user by ID (public)" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: "User retrieved successfully",
    type: UserRes,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized (invalid or missing token)",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden (only owner or admin can access)",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @Request() req: { user?: { sub?: number; role?: Role } }
  ): Promise<UserRes> {
    try {
      const isAdmin = req.user?.role === Role.ADMIN;
      const isOwner = req.user?.sub === id;
      if (!isAdmin && !isOwner) {
        throw new ForbiddenException("You can only access your own profile");
      }
      const user = await this.userService.findOne(id);
      return this.buildUserResponse(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to fetch user");
    }
  }

  /**
   * Update an existing user
   */
  @ApiOperation({ summary: "Update user by ID (owner or admin)" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    type: UserRes,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized (invalid or missing token)",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden (only owner or admin can update)",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 409, description: "Email or phone already exists" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: { user?: { sub?: number; role?: Role } }
  ): Promise<UserRes> {
    try {
      const isAdmin = req.user?.role === Role.ADMIN;
      const isOwner = req.user?.sub === id;
      if (!isAdmin && !isOwner) {
        throw new ForbiddenException("You can only update your own profile");
      }
      const updatedUser = await this.userService.update(id, updateUserDto);
      return this.buildUserResponse(updatedUser);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to update user");
    }
  }

  /**
   * Delete a user
   */
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete user by ID (admin only)" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({
    status: 401,
    description: "Unauthorized (invalid or missing token)",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden (admin access required)",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    try {
      await this.userService.remove(id);
      return { message: `User with ID ${id} deleted successfully` };
    } catch (error) {
      throw new Error(
        `Failed to delete user: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private buildUserResponse(user: IUser): UserRes {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName ?? "",
      email: user.email,
      phone: user.phone ?? "",
      address: user.address ?? "",
      role: user.role,
      dob: user.dob ?? undefined,
      lastLoggedIn: user.lastLoggedIn ?? undefined,
      gender: user.gender ?? "",
      bloodGroup: user.bloodGroup ?? "",
      avatar: user.avatar ?? "",
      isVerified: user.isVerified ?? false,
      isBlocked: user.isBlocked ?? false,
      createdAt: user.createdAt ?? undefined,
      updatedAt: user.updatedAt ?? undefined,
    };
  }
}
