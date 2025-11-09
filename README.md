# PayPlanner

Telegram Mini App для управления подписками с автоматическими уведомлениями о предстоящих списаниях.

## Возможности

- Отслеживание регулярных подписок и платежей
- Календарь с визуализацией дат списаний
- Автоматические уведомления за день до списания
- Поддержка нескольких валют (RUB, USD, EUR)
- Расчет ежемесячных расходов
- Категоризация подписок

## Технологии

**Frontend:**
- React + TypeScript + Vite
- Tailwind CSS + Ant Design
- Zustand (управление состоянием)
- Telegram WebApp SDK

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL + Drizzle ORM
- Telegram Bot API
- Node-cron (планировщик уведомлений)

**Инфраструктура:**
- Vercel (Frontend)
- Docker + Docker Compose (Backend + DB)

## Быстрый старт

```bash
npm install
npm run dev
```

## API

- `GET /api/subscriptions` - Получить подписки
- `POST /api/subscriptions` - Создать подписку
- `PATCH /api/subscriptions/:id` - Обновить подписку
- `DELETE /api/subscriptions/:id` - Удалить подписку
- `POST /api/webhook` - Telegram webhook

## Структура проекта

```
PayPlanner/
├── frontend/           # React приложение
│   ├── src/
│   │   ├── components/ # React компоненты
│   │   ├── lib/        # API клиент
│   │   ├── store/      # Zustand store
│   │   └── utils/      # Утилиты
│   └── vercel.json
│
├── backend/            # Express сервер
│   ├── src/
│   │   ├── db/         # Схемы БД
│   │   ├── routes/     # API endpoints
│   │   └── services/   # Бизнес-логика
│   └── Dockerfile
│
└── docker-compose.yml
```

## Лицензия

MIT
