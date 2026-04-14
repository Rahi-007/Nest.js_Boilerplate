import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator, DiskHealthIndicator } from "@nestjs/terminus";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ConfigurationService } from "../config/configuration";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private configService: ConfigurationService
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: "Check application health status" })
  @ApiResponse({
    status: 200,
    description: "Application is healthy",
  })
  @ApiResponse({
    status: 503,
    description: "Application is unhealthy",
  })
  check() {
    return this.health.check([
      // HTTP health check (self)
      () => this.http.pingCheck("self", `http://localhost:${this.configService.app.port}/api/health/ping`),
      // Memory health check
      () => this.memory.checkHeap("memory_heap", 150 * 1024 * 1024), // 150MB threshold
      () => this.memory.checkRSS("memory_rss", 300 * 1024 * 1024), // 300MB threshold
      // Disk storage health check
      () =>
        this.disk.checkStorage("disk_storage", {
          path: process.platform === "win32" ? "C:\\" : "/",
          thresholdPercent: 0.9, // 90% usage threshold
        }),
    ]);
  }

  @Get("ping")
  @ApiOperation({ summary: "Simple ping endpoint" })
  @ApiResponse({
    status: 200,
    description: "Pong response",
  })
  ping() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "Nest.js Boilerplate",
      version: "1.0.0",
    };
  }

  @Get("info")
  @ApiOperation({ summary: "Get application information" })
  @ApiResponse({
    status: 200,
    description: "Application information",
  })
  info() {
    return {
      service: "Nest.js Boilerplate",
      version: "1.0.0",
      environment: this.configService.app.environment,
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    };
  }
}
