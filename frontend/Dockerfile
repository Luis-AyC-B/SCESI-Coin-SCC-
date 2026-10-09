# Contexto de build: raíz del repo (el frontend importa seed/data.json)
FROM node:22-alpine

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY seed /app/seed
COPY frontend .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
