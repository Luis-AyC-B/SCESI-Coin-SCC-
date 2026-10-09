# SCESI Coin

Sistema de economía interna de la SCESI (UMSS). Los miembros ganan **SCESI Coin (SCC)** por sus aportes; la mesa directiva emite los SCC y todo queda registrado en una blockchain privada.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite + TypeScript, Tailwind, TanStack Query, React Router, Recharts |
| Backend | FastAPI, SQLAlchemy 2 + Alembic, Pydantic |
| Base de datos | PostgreSQL |
| Blockchain | Anvil (Foundry) + Solidity (OpenZeppelin), web3.py |
| Infra | Docker Compose |

## Estructura

```
backend/    API FastAPI
frontend/   App React
contracts/  Contratos Solidity (Foundry)
```

## Levantar en local

```bash
cp .env.example .env
docker compose up -d db chain     # Postgres + Anvil
cd backend && uv sync && uv run alembic upgrade head && uv run fastapi dev app/main.py
cd frontend && npm install && npm run dev
```
