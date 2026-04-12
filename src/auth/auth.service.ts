import * as bcrypt from "bcryptjs";
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "./dto/logIn.dto";
import { EntityManager } from "@mikro-orm/core";
import { UserSchema, IUser } from "./entity/user.entity";
import { CreateUserDto } from "./dto/user.dto";

interface ICreateUserDto extends CreateUserDto {
  createdAt?: Date;
}

@Injectable()
export class AuthService {
  constructor(private readonly em: EntityManager) {}

  // User Login
  async validateUser(loginDto: LoginDto): Promise<IUser> {
    // Find user by email
    const user = await this.em.findOne(UserSchema, { email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Compare password with hash
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    user.lastLoggedIn = new Date();
    await this.em.flush();

    return user;
  }

  // Create a new user
  async create(createUserDto: ICreateUserDto): Promise<IUser> {
    // Check if email already exists
    const existingEmail = await this.em.findOne(UserSchema, {
      email: createUserDto.email,
    });
    if (existingEmail) {
      throw new ConflictException("Email already exists");
    }

    // Check if phone already exists (if provided)
    if (createUserDto.phone) {
      const existingPhone = await this.em.findOne(UserSchema, {
        phone: createUserDto.phone,
      });
      if (existingPhone) {
        throw new ConflictException("Phone number already exists");
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds
    );

    const user = this.em.create(UserSchema, {
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phone: createUserDto.phone,
      email: createUserDto.email,
      passHash: hashedPassword,
      address: createUserDto.address,
      dob: createUserDto.dob ? new Date(createUserDto.dob) : undefined,
      gender: createUserDto.gender,
      bloodGroup: createUserDto.bloodGroup,
      role: createUserDto.role,
      isVerified: createUserDto.isVerified || false,
      isBlocked: createUserDto.isBlocked || false,
      createdAt: new Date(),
    } as UserSchema);

    await this.em.flush();
    return user;
  }

  async updateLastLoggedIn(user: IUser): Promise<IUser> {
    user.lastLoggedIn = new Date();
    await this.em.flush();
    return user;
  }
}
