import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';


@Module({
imports: [
UsersModule,
ConfigModule,
JwtModule.registerAsync({
inject: [ConfigService],
useFactory: (cfg: ConfigService) => ({
secret: cfg.get<string>('jwt.secret'),
signOptions: { expiresIn: cfg.get<string>('jwt.expiresIn') },
}),
}),
],
providers: [AuthService, JwtStrategy],
controllers: [AuthController],
})
export class AuthModule {}