# Используем официальный Node образ
FROM node:20-alpine

RUN apk add --no-cache libc6-compat

# Рабочая директория
WORKDIR /app

# Устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm ci

# Копируем исходники
COPY . .

# Генерация Prisma клиента (без подключения к БД)
RUN npx prisma generate

# Сборка приложения
RUN npm run build

# Запуск
CMD ["node", "dist/src/main.js"]

# Порт приложения
EXPOSE 4200
