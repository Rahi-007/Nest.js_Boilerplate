# Nest.js Boilerplate

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green)](https://github.com/Rahi-007/Nest.js_Boilerplate)
[![Backend](https://img.shields.io/badge/Backend-NestJS-blueviolet)](https://nestjs.com/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)](https://www.postgresql.org/)
[![ORM](https://img.shields.io/badge/ORM-MikroORM-orange)](https://mikro-orm.io/)

## Overview

A production-ready Nest.js boilerplate with authentication, database integration, API documentation, and best practices pre-configured. This boilerplate is designed to help you start new projects quickly without spending time on repetitive setup tasks.

## Features

- 🔐 **JWT Authentication** - Complete auth system with access & refresh tokens
- 🗄️ **Database Integration** - PostgreSQL with MikroORM (supports other databases)
- 📚 **API Documentation** - Swagger/OpenAPI with Bearer auth support
- 🛡️ **Security** - Helmet, CORS, rate limiting, validation pipes
- 📊 **Health Checks** - Comprehensive health monitoring endpoints
- 🪵 **Logging** - Request/response logging with middleware and interceptors
- ⚡ **Performance** - Compression, caching, timeout handling
- 🔧 **Configuration** - Environment-based config with validation
- 🧪 **Testing** - Jest setup with test utilities
- 🎯 **Best Practices** - Modular architecture, DTOs, interceptors, filters

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+ (or use Neon.tech for cloud PostgreSQL)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Rahi-007/Nest.js_Boilerplate.git
cd Nest.js_Boilerplate
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Seed the database with initial data
```bash
npm run seed
```

5. Start the development server
```bash
npm run start:dev
```

The application will be available at `http://localhost:8001` (or your configured PORT).

## Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                # Data transfer objects
│   ├── entity/             # Database entities
│   ├── guards/             # Auth guards
│   └── decorators/         # Custom decorators
├── user/                   # User management module
├── config/                 # Configuration files
│   ├── jwt/               # JWT configuration
│   └── configuration.ts    # Config service
├── common/                 # Shared utilities
│   ├── filters/           # Exception filters
│   ├── interceptors/      # Request/response interceptors
│   └── middleware/        # HTTP middleware
├── health/                 # Health check endpoints
└── utils/                  # Utility functions and enums
```

## API Documentation

Once the application is running, access the Swagger UI at:
```
http://localhost:8001/api-docs
```

The documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Try-it-out functionality

## Authentication

The boilerplate includes a complete JWT authentication system:

- **Login**: `POST /api/auth/login`
- **Register**: `POST /api/auth/register`
- **Refresh Token**: `POST /api/auth/refresh`
- **Logout**: `POST /api/auth/logout`
- **Protected Routes**: Use `@UseGuards(JwtAuthGuard)`

## Environment Variables

Key environment variables (see `.env.example` for full list):

```env
# Server
PORT=8001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
# OR individual variables
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nest_boilerplate
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRES_IN=7d
```

## Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm run build` - Build the project
- `npm run test` - Run tests
- `npm run format` - Format code with Prettier
- `npm run seed` - Seed database with sample data

## Database

### Using PostgreSQL with MikroORM

The boilerplate uses MikroORM with PostgreSQL by default. To use a different database:

1. Install the appropriate driver:
```bash
# For MySQL
npm install @mikro-orm/mysql

# For SQLite
npm install @mikro-orm/sqlite
```

2. Update `mikro-orm.config.ts` with the correct driver.

### Migrations

Generate a new migration:
```bash
npx mikro-orm migration:create
```

Run migrations:
```bash
npx mikro-orm migration:up
```

## Extending the Boilerplate

### Adding a New Module

1. Generate a new module:
```bash
nest generate module products
nest generate controller products
nest generate service products
```

2. Add the module to `app.module.ts` imports.

### Adding New Entities

1. Create entity in appropriate module:
```typescript
@Entity()
export class Product {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  price!: number;
}
```

2. Add entity to MikroORM configuration.

## Deployment

### Docker Deployment

A `Dockerfile` is included for containerized deployment:

```bash
docker build -t nest-boilerplate .
docker run -p 8001:8001 --env-file .env nest-boilerplate
```

### Platform-Specific

- **Vercel**: Use the `vercel.json` configuration
- **Railway**: One-click deployment with environment variables
- **Heroku**: Add PostgreSQL addon and set environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [MikroORM](https://mikro-orm.io/) - TypeScript ORM for Node.js
- [Swagger](https://swagger.io/) - API documentation
- [Terminus](https://github.com/nestjs/terminus) - Health checks

## Support

For issues and feature requests, please open an issue on GitHub.