import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';


export class CreateUserDto {
@IsString()
@MinLength(2)
fname!: string;


@IsString()
@MinLength(2)
lname!: string;


@IsEmail()
email!: string;


@IsString()
@MinLength(6)
password!: string;


@IsOptional()
@IsString()
phone?: string;
}