FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Проверка что файлы созданы
RUN ls -la dist/

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle

# Проверка что файлы скопированы
RUN ls -la dist/
RUN ls -la drizzle/

EXPOSE 3000

CMD ["node", "dist/index.js"]

