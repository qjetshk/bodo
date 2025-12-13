# Stage 1: сборка
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Копируем и ставим все зависимости
COPY package*.json ./
RUN npm install

# Копируем исходники
COPY . .

# Генерируем Prisma клиент и билдим TS
RUN npx prisma generate
RUN npm run build

# Stage 2: продакшн
FROM node:22-alpine AS prod

ENV NODE_ENV=prod

WORKDIR /app

# Копируем package.json и prod зависимости
COPY package*.json ./
RUN npm ci --omit=dev

# Копируем билд и Prisma schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Экспонируем порт (можно взять из .env)
EXPOSE 4200

# Запуск приложения
CMD ["node", "dist/main.js"]
