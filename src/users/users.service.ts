import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
constructor(
@InjectRepository(User) private readonly usersRepo: EntityRepository<User>,
private readonly em: EntityManager,
) {}


async create(dto: CreateUserDto): Promise<User> {
const exists = await this.usersRepo.findOne({ email: dto.email });
if (exists) throw new ConflictException('Email already in use');


const hashed = await bcrypt.hash(dto.password, 12);
const user = this.usersRepo.create({ ...dto, password: hashed });
await this.em.persistAndFlush(user);
return user;
}


async findByEmail(email: string): Promise<User | null> {
return this.usersRepo.findOne({ email });
}


async findById(id: number): Promise<User> {
const user = await this.usersRepo.findOne({ id });
if (!user) throw new NotFoundException('User not found');
return user;
}
}