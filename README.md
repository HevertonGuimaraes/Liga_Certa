# Liga Certa

Sistema SaaS de gestão de campeonatos esportivos — frontend React + backend NestJS.

## Stack

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React, TypeScript, Vite, TailwindCSS, Shadcn/UI, TanStack Query, React Hook Form, Zod, Framer Motion |
| **Backend** | NestJS, Prisma ORM, JWT, Bcrypt |
| **Banco** | MySQL (desacoplado — troca para PostgreSQL/SQL Server apenas via datasource Prisma) |

## Estrutura do projeto

```
liga_certa/
├── apps/
│   ├── web/          # Frontend React (porta 5173)
│   └── api/          # Backend NestJS (porta 3000)
├── docs/             # Documentação UX/UI e arquitetura
└── package.json      # Monorepo npm workspaces
```

---

## Como iniciar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) **20+**
- [npm](https://www.npmjs.com/) **10+**
- [MySQL](https://www.mysql.com/) **8+** em execução
- [Git](https://git-scm.com/)

### 1. Clonar o repositório

```bash
git clone https://github.com/HevertonGuimaraes/Liga_Certa.git
cd Liga_Certa
```

### 2. Instalar dependências

Na raiz do monorepo:

```bash
npm install
npm run setup
```

O comando `npm run setup` cria `apps/api/.env` e `apps/web/.env` a partir dos exemplos (se ainda não existirem).

> **Erro `DATABASE_URL not found`?** Execute `npm run setup` — o arquivo `.env` não vai para o GitHub por segurança.

### 3. Configurar variáveis de ambiente (se necessário)

Se quiser alterar senha do MySQL ou JWT, edite os arquivos criados:

**Backend** — `apps/api/.env`:

```env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/liga_certa"
JWT_SECRET="sua-chave-secreta-forte"
JWT_EXPIRES_IN="7d"
PORT=3000
```

**Frontend** — `apps/web/.env` (já criado pelo setup):

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Criar banco e schema (MySQL)

**Opção recomendada** — script automatizado na raiz do projeto:

```bash
# MySQL já rodando (local ou Docker)
npm run db:setup

# Sobe o MySQL via Docker Compose e aplica tudo
npm run db:setup:docker
```

O script:
1. Cria o banco `liga_certa` (utf8mb4), se ainda não existir
2. Gera o Prisma Client
3. Aplica as migrations (`prisma migrate deploy`)

**Alternativa manual** — no MySQL:

```sql
CREATE DATABASE liga_certa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Depois:

```bash
npm run db:generate
npm run db:migrate
```

Na primeira migration interativa, informe um nome (ex.: `init`) quando solicitado.

### 5. Subir a aplicação

Abra **dois terminais** na raiz do projeto:

**Terminal 1 — API:**

```bash
npm run dev:api
```

API disponível em: http://localhost:3000/api

**Terminal 2 — Frontend:**

```bash
npm run dev:web
```

Frontend disponível em: http://localhost:5173

### 6. Primeiro acesso

1. Acesse http://localhost:5173/register
2. Crie uma conta
3. Faça login em http://localhost:5173/login
4. Use o dashboard para gerenciar campeonatos, times, atletas e partidas

---

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run setup` | Cria `apps/api/.env` e `apps/web/.env` a partir dos exemplos |
| `npm run dev:web` | Inicia o frontend em modo desenvolvimento |
| `npm run dev:api` | Inicia a API NestJS em modo watch |
| `npm run build:web` | Build de produção do frontend |
| `npm run build:api` | Build de produção da API |
| `npm run db:setup` | Cria o banco MySQL e aplica o schema (migrations) |
| `npm run db:setup:docker` | Sobe MySQL no Docker + cria banco e schema |
| `npm run db:generate` | Gera o Prisma Client |
| `npm run db:migrate` | Executa migrations no banco (modo dev) |
| `npm run db:studio` | Abre o Prisma Studio (GUI do banco) |

---

## Módulos da API

- **auth** — Login, cadastro, recuperação de senha (JWT)
- **users** — Usuários e perfis (ADMIN, ORGANIZER, VIEWER)
- **championships** — Campeonatos
- **teams** — Times
- **players** — Atletas
- **coaches** — Técnicos
- **matches** — Partidas
- **standings** — Classificação
- **statistics** — Estatísticas e artilharia
- **public** — Links públicos (torcida, time, campeonato)

---

## Documentação adicional

- [Deploy no Railway](docs/DEPLOY-RAILWAY.md)
- [Auditoria UX/UI](docs/UX-UI-AUDIT.md)
- [Arquitetura](docs/ARCHITECTURE.md)

---

## Licença

Proprietário — Heverton Guimarães
