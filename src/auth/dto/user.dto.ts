import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";
import { BloodGroup, Gender, UserRole, UserStatus } from "src/utils/enums";

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: "First Name",
    example: "John",
  })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: "Last Name",
    example: "Doe",
  })
  @Transform(({ value }) => value?.trim())
  lastName?: string;

  @IsString()
  @ApiProperty({
    description: "Phone Number",
    example: "1234567890",
    maxLength: 24,
  })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: "Email",
    example: "Wl1yS@example.com",
    maxLength: 64,
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: "Password",
    minLength: 8,
  })
  password?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: "Address",
    example: "123 Main Street, USA",
  })
  @Transform(({ value }) => value?.trim())
  address?: string;

  @ApiPropertyOptional({ description: "Date of birth", example: "1990-01-01" })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value?.trim())
  dob?: string;

  @ApiPropertyOptional({
    description: "Gender of User",
    example: Gender.Male,
    enum: Gender,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    description: "Blood group of User",
    example: BloodGroup.O_POS,
    enum: BloodGroup,
  })
  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  @ApiPropertyOptional({
    description: "Role of User",
    example: UserRole.USER,
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class CustomerRes {
  @Expose()
  @IsInt()
  id: number;

  @Expose()
  @IsString()
  firstName: string;

  @Expose()
  @IsString()
  @IsOptional()
  lastName: string;

  @Expose()
  @IsString()
  phone: string;

  @Expose()
  @IsString()
  @IsOptional()
  email: string;

  @Expose()
  @IsString()
  @IsOptional()
  address: string;

  @Expose()
  @IsOptional()
  @IsDate()
  dob?: Date;

  @Expose()
  @IsString()
  @IsOptional()
  gender?: string;

  @Expose()
  @IsString()
  @IsOptional()
  bloodGroup: string;

  @Expose()
  @IsEnum(UserStatus)
  status: UserStatus;

  @Expose()
  @IsEnum(UserRole)
  role: UserRole;
}
