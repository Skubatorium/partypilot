# 🎉 PartyPilot

A modern web application for organizing parties and events.

## 🚀 Technology Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: Clerk
- **Package Management**: pnpm Workspace

## 📋 Prerequisites

- Node.js (>= 18)
- pnpm
- Docker Desktop
- Git

## 🛠 Installation

1. Clone repository:
   ```bash
   git clone https://github.com/yourusername/partypilot.git
   cd partypilot
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   # In apps/frontend/.env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key

   # In apps/backend/.env
   DATABASE_URL="postgresql://partypilot:partypilot@localhost:5432/partypilot?schema=public"
   PORT=3001
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

## 🚀 Development

### Database

```bash
cd apps/backend
pnpm db:start          # Start PostgreSQL
pnpm prisma:generate   # Generate Prisma Client
pnpm prisma:migrate    # Create database migrations
pnpm prisma:apply      # Apply migrations
pnpm prisma:studio     # Open database UI
```

### Backend & Frontend

```bash
# Option 1: Start everything together
cd apps/backend
pnpm dev:all

# Option 2: Separate terminals
cd apps/frontend
pnpm dev

cd apps/backend
pnpm dev
```

## 📚 Available Endpoints

- Frontend: https://localhost:3000
- Backend: http://localhost:3001
- Prisma Studio: http://localhost:5555
- PostgreSQL: localhost:5432

## 🌍 Internationalization

The application currently supports:
- 🇩🇪 German (default)
- 🇬🇧 English (planned)

The user interface is currently in German, with internationalization support being implemented for future language additions.

## 👥 Authentication

User authentication is handled through Clerk:
- OAuth support (Google, Apple)
- Email/Password sign-in
- Secure session management

## 📝 Development Guidelines

1. **Code**:
   - All code comments in English
   - Variable names in English
   - Function names in English
   - Directory names in English
   - Git commits in English

2. **User Interface**:
   - Currently in German
   - Internationalization support prepared for future languages
   - Translation files managed in `src/i18n/locales/`

3. **Documentation**:
   - All documentation in English
   - API documentation in English
   - Code comments in English

4. **Database**:
   - Table names in English
   - Column names in English
   - Queries in English

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request