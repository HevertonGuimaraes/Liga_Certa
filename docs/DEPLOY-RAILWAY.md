# Deploy no Railway — Liga Certa

Guia para hospedar **MySQL + API + Frontend** no [Railway](https://railway.app) a partir do repositório GitHub.

Repositório: https://github.com/HevertonGuimaraes/Liga_Certa

---

## Por que Railway?

- Os **3 serviços** ficam no mesmo projeto (MySQL, API NestJS, React)
- Conecta direto ao **GitHub** — push na `main` redeploya
- Domínio público gratuito (`*.up.railway.app`)
- Crédito free mensal (~US$ 5) — suficiente para MVP e demos

---

## Visão geral

```
┌─────────────────────────────────────────────┐
│           Projeto Railway                   │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  MySQL   │  │   API    │  │   Web   │ │
│  │ (plugin) │◄─┤ NestJS   │  │  React  │ │
│  └──────────┘  └────┬─────┘  └────┬────┘ │
│                     │             │       │
│              DATABASE_URL    VITE_API_URL │
└─────────────────────────────────────────────┘
         ▲                              ▲
         │                              │
    usuário acessa              build-time env
    https://web-xxx.up.railway.app
```

---

## Passo 1 — Criar projeto

1. Acesse [railway.app](https://railway.app) e faça login com **GitHub**
2. **New Project** → **Deploy from GitHub repo**
3. Selecione `HevertonGuimaraes/Liga_Certa`
4. Railway pode detectar o monorepo e sugerir serviços — você pode aceitar ou configurar manualmente abaixo

---

## Passo 2 — MySQL

1. No canvas do projeto: **+ New** → **Database** → **MySQL**
2. Aguarde provisionar
3. Clique no serviço MySQL → **Variables** → copie `MYSQL_URL` ou use **Connect** para referenciar em outros serviços

> O Prisma espera `mysql://...`. A variável `MYSQL_URL` do Railway já vem nesse formato.

---

## Passo 3 — API (NestJS)

1. **+ New** → **GitHub Repo** → mesmo repositório `Liga_Certa`
2. Renomeie o serviço para `api` (opcional, facilita organização)
3. **Settings**:

| Campo | Valor |
|-------|--------|
| **Config file** | `/apps/api/railway.toml` |
| **Root Directory** | *(deixe vazio — raiz do repo)* |

4. **Variables** (aba Variables):

| Variável | Valor |
|----------|--------|
| `DATABASE_URL` | `${{MySQL.MYSQL_URL}}` *(referência ao serviço MySQL)* |
| `JWT_SECRET` | string longa aleatória (ex.: gere com `openssl rand -hex 32`) |
| `JWT_EXPIRES_IN` | `7d` |
| `PORT` | `3000` |

> Para referenciar o MySQL: clique **Add Reference** → selecione o serviço MySQL → `MYSQL_URL`, e renomeie para `DATABASE_URL` se necessário.

5. **Networking** → **Generate Domain** → anote a URL, ex.: `https://liga-certa-api-production.up.railway.app`

6. **Deploy** — na primeira vez o `preDeployCommand` roda `prisma migrate deploy` e cria as tabelas.

---

## Passo 4 — Frontend (React)

1. **+ New** → **GitHub Repo** → mesmo repositório
2. Renomeie para `web`
3. **Settings**:

| Campo | Valor |
|-------|--------|
| **Config file** | `/apps/web/railway.toml` |
| **Root Directory** | *(vazio)* |

4. **Variables** — **obrigatório antes do build**:

| Variável | Valor |
|----------|--------|
| `VITE_API_URL` | `https://SUA-URL-DA-API.up.railway.app/api` |
| `PORT` | `4173` |

⚠️ **`VITE_API_URL` é injetada no build** (Vite). Se mudar a URL da API depois, faça **Redeploy** do frontend.

5. **Networking** → **Generate Domain** → ex.: `https://liga-certa-web-production.up.railway.app`

---

## Passo 5 — Testar

1. Acesse a URL do **web**
2. Vá em `/register` e crie uma conta
3. Faça login em `/login`
4. Use o dashboard em `/dashboard`

Se a API retornar erro de conexão:
- Confirme `VITE_API_URL` com `/api` no final
- Confirme que a API está **Running** no Railway
- Veja os logs: serviço **api** → **Deployments** → último deploy

---

## Ordem de deploy (primeira vez)

1. MySQL (provisiona sozinho)
2. API (conecta no MySQL + migrations)
3. Web (precisa da URL pública da API no `VITE_API_URL`)

---

## Comandos locais (referência)

Equivalente ao que o Railway executa:

```bash
# Build API
npm install && npm run build:api

# Migrations (release)
npm run db:migrate:deploy

# Start API
npm run start:api

# Build Web (com URL da API)
VITE_API_URL=https://sua-api.up.railway.app/api npm run build:web

# Start Web
npm run start:web
```

---

## Watch paths (evitar redeploy desnecessário)

Já configurados nos `railway.toml`:

- **API** redeploya só se mudar `apps/api/**` ou `package.json`
- **Web** redeploya só se mudar `apps/web/**` ou `package.json`

---

## Custos e limites (plano free)

| Item | Detalhe |
|------|---------|
| Crédito mensal | ~US$ 5 (varia) |
| MySQL | Incluso no consumo de crédito |
| Sleep | Serviços **não dormem** (diferente do Render free) |
| Tráfego | Adequado para MVP / demo |

Quando o crédito acabar, os serviços param até o próximo ciclo ou upgrade para plano Hobby (~US$ 5/mês).

---

## Troubleshooting

### `P1001: Can't reach database server`
- API subiu antes do MySQL ficar pronto → **Redeploy** da API
- `DATABASE_URL` incorreta → use referência `${{MySQL.MYSQL_URL}}`

### Frontend chama `localhost:3000`
- `VITE_API_URL` não foi definida no build → configure e **Redeploy** o web

### Migrations falharam
- Logs do deploy → fase **pre-deploy**
- Rode localmente com a mesma URL: `npm run db:migrate:deploy`

### `EPERM` no Prisma (local)
- Pare a API local antes de `npm run db:setup`

---

## Próximos passos (opcional)

- Domínio customizado (`ligacerta.com`) em **Settings → Networking → Custom Domain**
- Variáveis por ambiente (staging / production)
- Backups automáticos do MySQL (plano pago)
