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

## Demo (frontend con datos mock)

Mientras el backend no expone la API, el frontend usa `seed/data.json` a través de `frontend/src/api/mock.ts` (los cambios viven en memoria; recargar la página los reinicia). Cada pantalla consume hooks de `frontend/src/api/*.ts`: para conectar el backend basta con cambiar esas funciones por llamadas a `api()`.

El selector **Ver como (demo)** del footer cambia de usuario sin recargar. Guion:

1. Ver como **Shamir (directiva)** → Admin → aprobar "Taller de Git para nuevos" de Franco (+4).
2. Ver como **Franco** → Premios → reclamar **Junior**.
3. Explorador → la EMISIÓN y el PREMIO aparecen en los dos últimos bloques.
