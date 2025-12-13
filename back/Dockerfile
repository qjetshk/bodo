# Stage 1: сборка
FROM node:22-alpine AS builder

# Устанавливаем совместимость libc
RUN apk add --no-cache libc6-compat

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь исходный код
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

# Билдим TypeScript в папку dist (по умолчанию tsconfig.json: outDir = dist)
RUN npm run build

# Stage 2: продакшн
FROM node:22-alpine AS prod

ENV NODE_ENV=production

WORKDIR /app

# Копируем package.json и устанавливаем только prod зависимости
COPY package*.json ./
RUN npm ci --omit=dev

# Копируем скомпилированный код и Prisma schema из Stage 1
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Экспонируем порт приложения
EXPOSE 4200

# Запуск приложения
CMD ["node", "dist/main.js"]
