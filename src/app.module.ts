import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ConfigurationModule } from "./config/configuration.module";
import { mikroOrmConfigFactory } from "./config/mikro-orm.config";
import { CustomJwtModule } from "./config/jwt/jwt.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { HealthModule } from "./health/health.module";
import { ConfigurationService } from "./config/configuration";

@Module({
  imports: [
    ConfigurationModule,
    MikroOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: (configService: ConfigurationService) => mikroOrmConfigFactory(configService),
      inject: [ConfigurationService],
    }),
    CustomJwtModule,
    AuthModule,
    UserModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
