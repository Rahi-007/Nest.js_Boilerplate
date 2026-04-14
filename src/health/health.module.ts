import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HttpModule } from "@nestjs/axios";
import { HealthController } from "./health.controller";
import { ConfigurationModule } from "../config/configuration.module";

@Module({
  imports: [TerminusModule, HttpModule, ConfigurationModule],
  controllers: [HealthController],
  exports: [TerminusModule],
})
export class HealthModule {}
