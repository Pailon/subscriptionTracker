# 📂 Структура проекта

```
telegram-subscription-tracker/
│
├── 📄 README.md                    # Полная документация
├── 📄 QUICKSTART.md                # Быстрый старт
├── 📄 LICENSE                      # MIT лицензия
├── 📄 package.json                 # Root package.json (workspaces)
├── 📄 .gitignore                   # Git ignore правила
├── 📄 .env.example                 # Пример переменных окружения
├── 📄 docker-compose.yml           # Docker конфигурация для Pi
│
├── 📁 backend/                     # Express сервер
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 drizzle.config.ts        # Конфигурация Drizzle ORM
│   ├── 📄 Dockerfile               # Docker образ для backend
│   ├── 📄 .dockerignore
│   ├── 📄 .env.example
│   │
│   └── 📁 src/
│       ├── 📄 index.ts             # Точка входа (Express app + cron)
│       │
│       ├── 📁 db/
│       │   ├── 📄 index.ts         # Drizzle client
│       │   ├── 📄 schema.ts        # Схемы БД (users, subscriptions)
│       │   └── 📄 migrate.ts       # Скрипт миграций
│       │
│       ├── 📁 middleware/
│       │   └── 📄 telegram-auth.ts # Валидация Telegram WebApp initData
│       │
│       ├── 📁 routes/
│       │   ├── 📄 subscriptions.ts # CRUD endpoints для подписок
│       │   └── 📄 webhook.ts       # Telegram webhook handler
│       │
│       └── 📁 services/
│           └── 📄 notification.service.ts  # Сервис уведомлений (cron)
│
├── 📁 frontend/                    # React приложение
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 tsconfig.node.json
│   ├── 📄 vite.config.ts           # Конфигурация Vite
│   ├── 📄 tailwind.config.js       # Конфигурация Tailwind CSS
│   ├── 📄 postcss.config.js
│   ├── 📄 vercel.json              # Конфигурация Vercel (SPA fallback)
│   ├── 📄 .env.example
│   ├── 📄 index.html
│   │
│   └── 📁 src/
│       ├── 📄 main.tsx             # Точка входа React
│       ├── 📄 App.tsx              # Главный компонент
│       ├── 📄 index.css            # Глобальные стили + Tailwind
│       ├── 📄 vite-env.d.ts        # TypeScript definitions для Vite
│       │
│       ├── 📁 components/
│       │   ├── 📄 MonthlyTotal.tsx         # Виджет общей суммы
│       │   ├── 📄 NextBilling.tsx          # Виджет ближайшего списания
│       │   ├── 📄 Calendar.tsx             # Календарь подписок
│       │   ├── 📄 SubscriptionCard.tsx     # Карточка подписки
│       │   └── 📄 AddSubscriptionModal.tsx # Модалка добавления
│       │
│       ├── 📁 lib/
│       │   ├── 📄 telegram.ts      # Telegram WebApp SDK wrapper
│       │   └── 📄 api.ts           # API клиент (fetch с auth)
│       │
│       ├── 📁 store/
│       │   └── 📄 useSubscriptionStore.ts  # Zustand store
│       │
│       ├── 📁 types/
│       │   └── 📄 index.ts         # TypeScript типы
│       │
│       └── 📁 utils/
│           └── 📄 calculations.ts  # Утилиты для расчётов
│
└── 📁 scripts/
    └── 📄 update-webhook.sh        # Скрипт установки Telegram webhook
```

## 🔑 Ключевые файлы

### Backend

- **`src/index.ts`** - Express сервер, CORS, роуты, cron job
- **`src/db/schema.ts`** - Drizzle ORM схемы (users, subscriptions)
- **`src/middleware/telegram-auth.ts`** - Валидация Telegram WebApp данных
- **`src/routes/subscriptions.ts`** - CRUD API для подписок
- **`src/services/notification.service.ts`** - Отправка уведомлений через Telegram Bot API

### Frontend

- **`src/App.tsx`** - Главный экран (все компоненты на одной странице)
- **`src/lib/api.ts`** - API клиент с автоматической передачей initData
- **`src/store/useSubscriptionStore.ts`** - Zustand store для управления состоянием
- **`src/utils/calculations.ts`** - Расчёт месячной суммы, ближайшего списания, календаря

### Конфигурация

- **`docker-compose.yml`** - PostgreSQL + Backend для Raspberry Pi
- **`backend/Dockerfile`** - Multi-stage build для production
- **`frontend/vercel.json`** - SPA fallback для Vercel
- **`scripts/update-webhook.sh`** - Автоматическая установка webhook

## 📦 Зависимости

### Backend

- **Runtime**: express, cors, dotenv, drizzle-orm, postgres, node-cron, node-telegram-bot-api
- **Dev**: typescript, tsx, @types/*, drizzle-kit

### Frontend

- **Runtime**: react, react-dom, zustand, date-fns
- **Dev**: vite, @vitejs/plugin-react, typescript, tailwindcss, postcss, autoprefixer

## 🚀 Команды

```bash
# Установка
npm install

# Разработка (frontend + backend одновременно)
npm run dev

# Сборка
npm run build

# Продакшн (только backend)
npm run start

# База данных
npm run db:generate -w backend  # Генерация миграций
npm run db:migrate -w backend   # Применение миграций
npm run db:studio -w backend    # UI для БД

# Docker
docker-compose up -d            # Запуск на Pi
docker-compose logs -f backend  # Логи
docker-compose down             # Остановка

# Webhook
./scripts/update-webhook.sh     # Обновить webhook
```

## 🌐 Деплой

- **Frontend**: Vercel (`vercel --prod`)
- **Backend + DB**: Raspberry Pi (Docker Compose)
- **Webhook**: CloudPub (`clo publish http 3000`)

## 📚 Документация

- [README.md](README.md) - Полная документация
- [QUICKSTART.md](QUICKSTART.md) - Быстрый старт

