# PartyPilot Backend

## Setup

1. Create a `.env` file in the `apps/backend` directory with the following content:
```env
# Server Configuration
PORT=3001

# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/partypilot?schema=public"

# Clerk Authentication
CLERK_WEBHOOK_SECRET="your_clerk_webhook_secret"
```

2. Create required directories:
```bash
mkdir -p logs
```

3. Install dependencies:
```bash
pnpm install
```

4. Start the development server:
```bash
pnpm dev
```

## API Documentation

The API documentation is available in OpenAPI format in `src/openapi.yaml`. You can view this documentation using tools like:
- [Swagger Editor](https://editor.swagger.io/)
- [Stoplight Studio](https://stoplight.io/studio)
- [Redocly](https://redocly.github.io/redoc/)

## Logging

The application uses Winston for logging with the following configuration:
- Console logs for development
- File-based logs in the `logs` directory:
  - `error.log`: Contains only error messages
  - `combined.log`: Contains all log messages

## Database

PostgreSQL database is used with Prisma as the ORM. The database can be managed using:
- `pnpm prisma:studio`: Open Prisma Studio
- `pnpm prisma:generate`: Generate Prisma Client
- `pnpm prisma:migrate`: Create a new migration
- `pnpm prisma:apply`: Apply pending migrations

## Development Scripts

- `pnpm dev`: Start the development server
- `pnpm dev:all`: Start all required services (database, server)
- `pnpm build`: Build the application
- `pnpm start`: Start the production server
- `pnpm db:start`: Start the database container
- `pnpm db:stop`: Stop the database container
- `pnpm db:reset`: Reset the database (caution: deletes all data) 