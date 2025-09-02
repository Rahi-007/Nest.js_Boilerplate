import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './config/mikro-orm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './config/jwt.config';


@Module({
imports: [
ConfigModule.forRoot({ isGlobal: true, load: [jwtConfig] }),
MikroOrmModule.forRootAsync({ useFactory: () => mikroOrmConfig }),
UsersModule,
AuthModule,
],
})
export class AppModule {}