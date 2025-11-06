# 🚀 Быстрый старт

## Минимальная настройка для локального запуска

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка PostgreSQL

Создайте базу данных:

```bash
createdb subscription_tracker
```

Или через psql:

```sql
CREATE DATABASE subscription_tracker;
```

### 3. Настройка переменных окружения

**Backend** (`backend/.env`):

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/subscription_tracker
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=your_bot_username
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Миграции базы данных

```bash
cd backend
npm run db:generate
npm run db:migrate
cd ..
```

### 5. Запуск приложения

```bash
# Из корневой директории
npm run dev
```

Приложение будет доступно:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### 6. Получение Telegram Bot Token

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Скопируйте токен в `backend/.env`

### 7. Настройка Mini App

1. В [@BotFather](https://t.me/BotFather) отправьте `/newapp`
2. Выберите вашего бота
3. Введите название и описание
4. Загрузите иконку (опционально)
5. Введите URL: `http://localhost:5173` (для разработки)

### 8. Настройка публичного доступа (для тестирования)

```bash
# Установите CloudPub
npm install -g cloudpub-cli

# Запустите туннель
clo publish http 3000
```

Обновите `WEBHOOK_URL` в `backend/.env` и запустите:

```bash
./scripts/update-webhook.sh
```

## Готово! 🎉

Откройте вашего бота в Telegram и отправьте `/start` для получения ссылки на Mini App.

---

Полная документация: [README.md](README.md)

