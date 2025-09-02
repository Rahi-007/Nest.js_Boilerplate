import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
constructor(
private readonly users: UsersService,
private readonly jwt: JwtService,
) {}


async register(dto: CreateUserDto) {
const user = await this.users.create(dto);
const token = await this.sign(user.id, user.email);
return { user: this.safe(user), access_token: token };
}


async login(email: string, password: string) {
const user = await this.users.findByEmail(email);
if (!user) throw new UnauthorizedException('Invalid credentials');


const ok = await bcrypt.compare(password, user.password);
if (!ok) throw new UnauthorizedException('Invalid credentials');


const token = await this.sign(user.id, user.email);
return { user: this.safe(user), access_token: token };
}


private async sign(sub: number, email: string) {
return this.jwt.signAsync({ sub, email });
}


private safe(user: any) {
const { password, ...rest } = user;
return rest;
}
}