# Arquitetura — Liga Certa

## Visão geral

Monorepo npm workspaces com frontend (Vite/React) e backend (NestJS) desacoplados do banco via Prisma Repository Pattern.

```
liga_certa/
├── apps/web/                 # Frontend
│   └── src/
│       ├── app/              # Providers globais (main)
│       ├── routes/           # React Router
│       ├── layouts/          # AppLayout, AuthLayout
│       ├── pages/            # Telas por domínio
│       ├── design-system/    # Tokens + componentes CVA
│       ├── api/              # Cliente Axios
│       ├── hooks/            # Custom hooks (extensível)
│       ├── types/            # Tipos compartilhados
│       └── utils/
└── apps/api/                 # Backend
    └── src/
        ├── core/             # Result, interfaces de repositório
        ├── infra/            # Prisma
        └── modules/          # auth, championships, teams, shared...
```

## Padrões backend

- **Clean Architecture:** use cases via services, controllers finos
- **Repository Pattern:** `IUserRepository`, `IChampionshipRepository`, etc.
- **DI:** NestJS providers injetam implementações Prisma
- **Soft Delete:** `deletedAt` em todas entidades
- **UUID:** identificadores em todas tabelas

## Desacoplamento do banco

Trocar MySQL → PostgreSQL:

1. Alterar `provider` em `schema.prisma`
2. Atualizar `DATABASE_URL`
3. Rodar nova migration

Regras de negócio não importam `@prisma/client` diretamente nos use cases — apenas nos repositórios.

## Autenticação

JWT Bearer via Passport. Rotas `/api/auth/*` públicas; demais protegidas com `AuthGuard('jwt')`.

## Performance (preparado)

- Paginação: interfaces prontas para `page/pageSize`
- Cache: React Query staleTime 30s
- Futuro: Redis, filas, auditoria
