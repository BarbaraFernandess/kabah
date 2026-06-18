# Kabah — Numerologia Cabalística

Plataforma completa de Numerologia Cabalística baseada **exclusivamente** na metodologia de Sonia Café. Calcula 16 números numerológicos com trilha de auditoria completa (fórmula, passos e nota metodológica) para cada resultado.

---

## Sumário

- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Rodar com Docker (recomendado)](#rodar-com-docker-recomendado)
- [Rodar Localmente (desenvolvimento)](#rodar-localmente-desenvolvimento)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Banco de Dados](#banco-de-dados)
- [Testes](#testes)
- [Credenciais Padrão](#credenciais-padrão)
- [Rotas da API](#rotas-da-api)
- [Cálculos Disponíveis](#cálculos-disponíveis)

---

## Tecnologias

| Camada | Stack |
|--------|-------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, React Router v6 |
| Backend | Node.js 20, Express, TypeScript, Zod |
| Banco de dados | PostgreSQL 16, Prisma ORM |
| Engine | TypeScript puro, zero dependências externas |
| Monorepo | npm workspaces + Turborepo |
| Auth | JWT (stateless) |
| Infra | Docker, Docker Compose, Nginx |

---

## Estrutura do Projeto

```
kabah/
├── apps/
│   ├── api/                  # Servidor Express (porta 3001)
│   │   ├── src/
│   │   │   ├── modules/      # auth, analysis, reports, admin
│   │   │   ├── database/     # Prisma schema + seeds
│   │   │   └── shared/       # errors, logger, validation
│   │   └── tests/
│   └── web/                  # React SPA (porta 5173 dev / 80 prod)
│       └── src/
│           ├── pages/        # Login, Dashboard, Nova Análise, Detalhe, Histórico, Admin
│           ├── components/   # NumerologyCard, CalculationTrace, LifeCycleTimeline…
│           ├── hooks/        # useAuth, useAnalysis
│           └── services/     # api.ts, auth.service, analysis.service
├── packages/
│   ├── engine/               # Motor de cálculo (154 testes, zero deps externas)
│   │   └── src/
│   │       ├── calculators/  # 15 calculadoras individuais
│   │       ├── config/       # numerology.config.json (tabela hebraica adaptada)
│   │       ├── reducers/     # Redução numérica + números mestres + dívidas kármicas
│   │       ├── normalizers/  # Normalização de nomes + filtro de partículas
│   │       └── tables/       # Tabela de letras
│   └── knowledge/            # Interpretações em JSON (destino, alma, karma…)
├── docker-compose.yml
├── turbo.json
└── package.json
```

---

## Pré-requisitos

### Para rodar com Docker
- [Docker](https://docs.docker.com/get-docker/) ≥ 24
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2

### Para rodar localmente
- [Node.js](https://nodejs.org/) ≥ 20
- [npm](https://www.npmjs.com/) ≥ 10
- [PostgreSQL](https://www.postgresql.org/) ≥ 15

---

## Rodar com Docker (recomendado)

A forma mais rápida de subir o ambiente completo (banco, API e frontend) com um único comando.

### 1. Clone o repositório

```bash
git clone https://github.com/BarbaraFernandess/kabah.git
cd kabah
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` e defina pelo menos:

```env
JWT_SECRET=uma-string-aleatoria-longa-aqui
FRONTEND_URL=http://localhost:5173
```

### 3. Suba os containers

```bash
docker compose up --build
```

Aguarde até ver a mensagem `Kabah API running on port 3001`. Na primeira vez o build pode levar alguns minutos.

### 4. Rode as migrations e o seed

Em outro terminal (enquanto os containers estão rodando):

```bash
docker compose exec api npx prisma migrate deploy
docker compose exec api npm run db:seed
```

### 5. Acesse

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:3001 |
| Health check | http://localhost:3001/health |

Para parar:

```bash
docker compose down
```

Para parar e remover os dados do banco:

```bash
docker compose down -v
```

---

## Rodar Localmente (desenvolvimento)

### 1. Clone o repositório

```bash
git clone https://github.com/BarbaraFernandess/kabah.git
cd kabah
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

Crie um banco PostgreSQL local:

```sql
CREATE USER kabah WITH PASSWORD 'kabah';
CREATE DATABASE kabah OWNER kabah;
```

Ou via linha de comando:

```bash
createuser -P kabah       # senha: kabah
createdb -O kabah kabah
```

### 4. Configure as variáveis de ambiente

**API:**

```bash
cp apps/api/.env.example apps/api/.env
```

```env
DATABASE_URL="postgresql://kabah:kabah@localhost:5432/kabah"
JWT_SECRET="troque-por-uma-string-aleatoria-longa"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
```

**Raiz (opcional, para scripts globais):**

```bash
cp .env.example .env
```

### 5. Gere o Prisma Client e rode as migrations

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
cd ../..
```

### 6. Popule o banco com dados iniciais

```bash
npm run db:seed
```

Isso cria:
- Usuário admin: `admin@kabah.app` / `Admin@2025!`
- Interpretações para todos os números (1–9, 11, 22, 33) nas categorias destino, missão, alma e personalidade

### 7. Suba o ambiente em modo de desenvolvimento

```bash
npm run dev
```

O Turborepo inicia todos os serviços em paralelo:

| Serviço | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:5173 |
| API (tsx watch) | http://localhost:3001 |

O frontend tem hot-reload. A API reinicia automaticamente ao salvar arquivos.

---

## Variáveis de Ambiente

### `.env` (raiz)

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `DATABASE_URL` | `postgresql://kabah:kabah@localhost:5432/kabah` | String de conexão PostgreSQL |
| `JWT_SECRET` | *(obrigatório em prod)* | Segredo para assinar tokens JWT |
| `JWT_EXPIRES_IN` | `7d` | Expiração dos tokens |
| `PORT` | `3001` | Porta da API |
| `NODE_ENV` | `development` | Ambiente |
| `FRONTEND_URL` | `http://localhost:5173` | URL do frontend (usada pelo CORS) |

### `apps/api/.env`

Mesmas variáveis acima, mais:

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `CORS_ORIGIN` | `http://localhost:5173` | Origem permitida pelo CORS |
| `ADMIN_EMAIL` | `admin@kabah.app` | Email do admin criado no seed |
| `ADMIN_PASSWORD` | `Admin@2025!` | Senha do admin criado no seed |

---

## Banco de Dados

### Comandos úteis

```bash
# Gerar client Prisma após alterar o schema
npm run db:generate

# Criar e aplicar uma nova migration (dev)
cd apps/api && npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
cd apps/api && npx prisma migrate deploy

# Popular o banco com dados iniciais
npm run db:seed

# Interface visual do banco (Prisma Studio)
cd apps/api && npx prisma studio
```

### Modelos do banco

| Modelo | Descrição |
|--------|-----------|
| `User` | Usuários com roles `USER` e `ADMIN` |
| `Analysis` | Análises numerológicas (resultado completo em JSON) |
| `Interpretation` | Interpretações editáveis pelo admin (título, descrição, palavras-chave…) |
| `NumerologyConfig` | Configurações metodológicas editáveis via painel admin |

---

## Testes

### Rodar todos os testes

```bash
npm run test
```

### Engine (154 testes)

```bash
cd packages/engine
npm test
```

Cobre: reducer numérico, normalização de nomes, cálculo de destino, alma, personalidade, karma, ciclos de vida, desafios e análise completa.

### API (15 testes)

```bash
cd apps/api
npm test
```

Cobre: registro, login, autenticação JWT, criação/listagem/exclusão de análises, ownership enforcement.

---

## Credenciais Padrão

Após rodar o seed:

| Campo | Valor |
|-------|-------|
| Email | `admin@kabah.app` |
| Senha | `Admin@2025!` |
| Role | `ADMIN` |

O painel admin está em `/admin` e permite editar as interpretações de todos os números sem precisar alterar código.

---

## Rotas da API

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/auth/register` | Cadastrar usuário |
| `POST` | `/api/auth/login` | Login (retorna JWT) |
| `GET` | `/api/auth/me` | Perfil do usuário autenticado |

### Análises

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/analyses` | Criar nova análise |
| `GET` | `/api/analyses` | Listar análises do usuário |
| `GET` | `/api/analyses/:id` | Buscar análise por ID |
| `DELETE` | `/api/analyses/:id` | Excluir análise |
| `GET` | `/api/analyses/:id/report` | Relatório JSON enriquecido |
| `GET` | `/api/analyses/:id/pdf` | Relatório HTML para impressão/PDF |

### Admin *(requer role ADMIN)*

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/admin/interpretations` | Listar interpretações |
| `PUT` | `/api/admin/interpretations/:id` | Editar interpretação |
| `GET` | `/api/admin/config` | Listar configurações |
| `PUT` | `/api/admin/config/:key` | Atualizar configuração |

---

## Cálculos Disponíveis

Todos os cálculos seguem **exclusivamente** a metodologia de Sonia Café com tabela hebraica adaptada (A=1…I=9, J=1…R=9, S=1…Z=8). Partículas (de, da, do, dos, das, e) são ignoradas em todos os cálculos. Números mestres (11, 22, 33) nunca são reduzidos.

| # | Cálculo | Base |
|---|---------|------|
| 1 | Destino | Data de nascimento |
| 2 | Missão | Todas as letras do nome de nascimento |
| 3 | Alma | Vogais do nome de nascimento |
| 4 | Personalidade | Consoantes do nome de nascimento |
| 5 | Expressão | Destino + Missão |
| 6 | Motivação | Vogais do nome atual (ou = Alma) |
| 7 | Impressão | Consoantes do nome atual (ou = Personalidade) |
| 8 | Maturidade | Destino + Missão (ativo a partir dos ~35 anos) |
| 9 | Lições Kármicas | Dígitos 1–9 ausentes no nome |
| 10 | Dívidas Kármicas | 13, 14, 16, 19 detectados antes da redução final |
| 11 | Tendências Ocultas | Dígitos com frequência ≥ 3 no nome |
| 12 | Ciclo Formativo | Mês de nascimento reduzido (0 até 36−Destino anos) |
| 13 | Ciclo Produtivo | Dia de nascimento reduzido (27 anos de duração) |
| 14 | Ciclo de Colheita | Ano de nascimento reduzido (resto da vida) |
| 15 | Desafios (4) | Diferenças absolutas entre componentes da data |
| 16 | Ano / Mês / Dia Pessoal | Data de referência + data de nascimento |

Cada resultado inclui **fórmula**, **passos numerados** e **nota metodológica** completos, visíveis na interface pelo acordeão "Ver Cálculo".
