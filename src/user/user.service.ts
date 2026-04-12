import * as bcrypt from "bcryptjs";
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { EntityManager } from "@mikro-orm/core";
import { UpdateUserDto } from "../auth/dto/user.dto";
import { IUser, UserSchema } from "../auth/entity/user.entity";

interface IUpdateUserDto extends UpdateUserDto {
  updatedAt?: Date;
}

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}

  // Get all users
  async findAll(): Promise<IUser[]> {
    return this.em.find(UserSchema, {});
  }

  // Get user by ID
  async findOne(id: number): Promise<IUser> {
    const user = await this.em.findOne(UserSchema, { id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Update an existing user
  async update(id: number, updateUserDto: IUpdateUserDto): Promise<IUser> {
    const user = await this.findOne(id);

    // Check if email is being changed and already exists for another user
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.em.findOne(UserSchema, {
        email: updateUserDto.email,
      });
      if (existingEmail && existingEmail.id !== id) {
        throw new ConflictException("Email already exists");
      }
    }

    // Check if phone is being changed and already exists for another user
    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingPhone = await this.em.findOne(UserSchema, {
        phone: updateUserDto.phone,
      });
      if (existingPhone && existingPhone.id !== id) {
        throw new ConflictException("Phone number already exists");
      }
    }

    // Update only provided fields
    if (updateUserDto.firstName !== undefined) {
      user.firstName = updateUserDto.firstName;
    }
    if (updateUserDto.lastName !== undefined) {
      user.lastName = updateUserDto.lastName;
    }
    if (updateUserDto.phone !== undefined) {
      user.phone = updateUserDto.phone;
    }
    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.password !== undefined) {
      // Hash new password
      const saltRounds = 10;
      user.passHash = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
    if (updateUserDto.address !== undefined) {
      user.address = updateUserDto.address;
    }
    if (updateUserDto.dob !== undefined) {
      user.dob = updateUserDto.dob ? new Date(updateUserDto.dob) : undefined;
    }
    if (updateUserDto.gender !== undefined) {
      user.gender = updateUserDto.gender;
    }
    if (updateUserDto.bloodGroup !== undefined) {
      user.bloodGroup = updateUserDto.bloodGroup;
    }
    if (updateUserDto.avatar !== undefined) {
      user.avatar = updateUserDto.avatar;
    }
    if (updateUserDto.isVerified !== undefined) {
      user.isVerified = updateUserDto.isVerified;
    }
    if (updateUserDto.isBlocked !== undefined) {
      user.isBlocked = updateUserDto.isBlocked;
    }
    if (updateUserDto.role !== undefined) {
      user.role = updateUserDto.role;
    }

    // Update timestamp
    user.updatedAt = new Date();

    await this.em.flush();
    return user;
  }

  // Delete a user
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.em.remove(user);
    await this.em.flush();
  }
}
