# Liga Certa

Sistema SaaS de gestão de campeonatos esportivos — frontend React + backend NestJS.

## Stack

- **Frontend:** React, TypeScript, Vite, TailwindCSS, Shadcn/UI, TanStack Query, React Hook Form, Zod, Framer Motion
- **Backend:** NestJS, Prisma ORM, JWT, Bcrypt
- **Banco:** MySQL (desacoplado — troca para PostgreSQL/SQL Server via datasource Prisma)

## Estrutura

```
liga_certa/
├── apps/
│   ├── web/          # Frontend React
│   └── api/          # Backend NestJS
├── docs/             # Documentação UX/UI e arquitetura
└── package.json      # Monorepo workspaces
```

## Pré-requisitos

- Node.js 20+
- MySQL 8+
- npm 10+

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Banco de dados

Copie `apps/api/.env.example` para `apps/api/.env` e configure `DATABASE_URL`.

```bash
npm run db:generate
npm run db:migrate
```

### 3. Desenvolvimento

```bash
# API (porta 3000)
npm run dev:api

# Web (porta 5173)
npm run dev:web
```

## Módulos

Auth, Users, Championships, Teams, Players, Coaches, Matches, Standings, Statistics, Public links.

## Licença

Proprietário — Heverton Guimarães
