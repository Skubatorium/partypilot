# 🚀 Partypilot

Partypilot ist eine Webanwendung zur einfachen Organisation von Partys, Feiern und Nachbarschaftstreffen.

## 📝 Über das Projekt

Mit Partypilot können Benutzer:innen:
- Sich registrieren und einloggen
- Communities gründen oder beitreten
- Partys erstellen und verwalten
- Mitbringlisten koordinieren

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Clerk (Auth)

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM

### Testing
- Playwright (E2E)
- Jest (Unit Tests)

## 🚀 Getting Started

### Voraussetzungen
- Node.js (v18 oder höher)
- PostgreSQL
- pnpm (für Monorepo-Management)

### Installation

1. Repository klonen
```bash
git clone https://github.com/yourusername/partypilot.git
cd partypilot
```

2. Dependencies installieren
```bash
pnpm install
```

3. Entwicklungsserver starten
```bash
# Frontend starten
pnpm --filter frontend dev

# Backend starten
pnpm --filter backend dev
```

## 📁 Projektstruktur

```
partypilot/
├── apps/
│   ├── frontend/          → React + Tailwind + TS (UI, Modals, Forms)
│   └── backend/           → Node.js + Express + TS (API, Auth, DB)
├── prisma/                → Prisma Schema + Migrations
├── docs/                  → Konzept, Use Cases, Screens, Fragen
├── package.json          
└── README.md
```

## 📄 Lizenz

MIT