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
```

### 3. Configurar variáveis de ambiente

**Backend** — copie o exemplo e edite com seus dados:

```bash
# Windows (PowerShell)
copy apps\api\.env.example apps\api\.env

# Linux / macOS
cp apps/api/.env.example apps/api/.env
```

Edite `apps/api/.env`:

```env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/liga_certa"
JWT_SECRET="sua-chave-secreta-forte"
JWT_EXPIRES_IN="7d"
PORT=3000
```

**Frontend** — copie o exemplo:

```bash
# Windows
copy apps\web\.env.example apps\web\.env

# Linux / macOS
cp apps/web/.env.example apps/web/.env
```

O arquivo `apps/web/.env` já vem com:

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Criar o banco de dados MySQL

No MySQL, execute:

```sql
CREATE DATABASE liga_certa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Gerar o Prisma Client e rodar migrations

Na raiz do projeto:

```bash
npm run db:generate
npm run db:migrate
```

Na primeira migration, informe um nome (ex.: `init`) quando solicitado.

### 6. Subir a aplicação

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

### 7. Primeiro acesso

1. Acesse http://localhost:5173/register
2. Crie uma conta
3. Faça login em http://localhost:5173/login
4. Use o dashboard para gerenciar campeonatos, times, atletas e partidas

---

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev:web` | Inicia o frontend em modo desenvolvimento |
| `npm run dev:api` | Inicia a API NestJS em modo watch |
| `npm run build:web` | Build de produção do frontend |
| `npm run build:api` | Build de produção da API |
| `npm run db:generate` | Gera o Prisma Client |
| `npm run db:migrate` | Executa migrations no banco |
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

- [Auditoria UX/UI](docs/UX-UI-AUDIT.md)
- [Arquitetura](docs/ARCHITECTURE.md)

---

## Licença

Proprietário — Heverton Guimarães
