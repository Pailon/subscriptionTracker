# 📱 Telegram Subscription Tracker

Telegram Mini App для отслеживания подписок с уведомлениями о предстоящих списаниях.

## 🏗️ Архитектура

- **Frontend**: React + Vite + TypeScript + Tailwind CSS + Zustand
- **Backend**: Node.js + Express + TypeScript + Drizzle ORM
- **Database**: PostgreSQL
- **Deployment**: 
  - Mini App → Vercel
  - Backend + DB → Raspberry Pi (Docker)
  - Webhook → CloudPub

## 📁 Структура проекта

```
.
├── frontend/              # React приложение
│   ├── src/
│   │   ├── components/   # React компоненты
│   │   ├── lib/          # API клиент и Telegram SDK
│   │   ├── store/        # Zustand store
│   │   ├── types/        # TypeScript типы
│   │   ├── utils/        # Утилиты и вычисления
│   │   ├── App.tsx       # Главный компонент
│   │   └── main.tsx      # Точка входа
│   ├── vercel.json       # Конфигурация Vercel
│   └── package.json
│
├── backend/              # Express сервер
│   ├── src/
│   │   ├── db/          # Drizzle ORM схемы и миграции
│   │   ├── middleware/  # Telegram auth middleware
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Бизнес-логика (уведомления)
│   │   └── index.ts     # Точка входа
│   ├── Dockerfile
│   └── package.json
│
├── scripts/
│   └── update-webhook.sh # Скрипт установки webhook
│
├── docker-compose.yml    # Docker конфигурация для Pi
├── .env.example          # Пример переменных окружения
└── README.md
```

## 🚀 Локальная разработка

### Предварительные требования

- Node.js 20+
- PostgreSQL 16+
- Telegram Bot Token (получить у [@BotFather](https://t.me/BotFather))

### 1. Клонирование и установка зависимостей

```bash
git clone <repository-url>
cd telegram-subscription-tracker

# Установка зависимостей для всего проекта
npm install

# Установка зависимостей для backend и frontend
npm install -w backend
npm install -w frontend
```

### 2. Настройка переменных окружения

#### Backend

Создайте файл `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Заполните переменные:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/subscription_tracker
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=your_bot_username
FRONTEND_URL=http://localhost:5173
```

#### Frontend

Создайте файл `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Настройка базы данных

```bash
# Создайте базу данных PostgreSQL
createdb subscription_tracker

# Сгенерируйте миграции
cd backend
npm run db:generate

# Примените миграции
npm run db:migrate
```

### 4. Запуск приложения

```bash
# Из корневой директории - запускает frontend и backend одновременно
npm run dev

# Или запускайте отдельно:
npm run dev -w backend   # Backend на http://localhost:3000
npm run dev -w frontend  # Frontend на http://localhost:5173
```

### 5. Настройка Telegram бота для локальной разработки

Для локальной разработки используйте CloudPub для создания публичного URL:

```bash
# Установите CloudPub (если ещё не установлен)
npm install -g cloudpub-cli

# Запустите туннель
clo publish http 3000
```

Скопируйте полученный URL и обновите webhook:

```bash
# Обновите WEBHOOK_URL в backend/.env
WEBHOOK_URL=https://your-cloudpub-url.com

# Запустите скрипт обновления webhook
chmod +x scripts/update-webhook.sh
./scripts/update-webhook.sh
```

Теперь откройте вашего бота в Telegram и отправьте `/start` для получения ссылки на Mini App.

## 🌐 Деплой на Vercel (Frontend)

### 1. Подготовка

Убедитесь, что у вас установлен [Vercel CLI](https://vercel.com/cli):

```bash
npm install -g vercel
```

### 2. Деплой

```bash
cd frontend

# Первый деплой (интерактивный)
vercel

# Продакшн деплой
vercel --prod
```

### 3. Настройка переменных окружения в Vercel

В дашборде Vercel добавьте переменную окружения:

- `VITE_API_URL` = `https://your-raspberry-pi-domain.com/api`

### 4. Обновление URL в Telegram боте

После деплоя обновите URL Mini App в настройках бота через [@BotFather](https://t.me/BotFather):

```
/setmenubutton
<выберите вашего бота>
<введите текст кнопки, например "Открыть приложение">
<введите URL: https://your-app.vercel.app>
```

## 🥧 Деплой на Raspberry Pi (Backend + Database)

### 1. Подготовка Raspberry Pi

Установите Docker и Docker Compose:

```bash
# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Добавьте пользователя в группу docker
sudo usermod -aG docker $USER

# Установите Docker Compose
sudo apt install docker-compose -y

# Перезагрузите систему
sudo reboot
```

### 2. Клонирование проекта на Pi

```bash
ssh pi@your-raspberry-pi-ip

git clone <repository-url>
cd telegram-subscription-tracker
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```bash
cp .env.example .env
```

Заполните переменные:

```env
POSTGRES_PASSWORD=your_secure_password
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_BOT_USERNAME=your_bot_username
FRONTEND_URL=https://your-app.vercel.app
WEBHOOK_URL=https://your-public-domain.com
```

### 4. Запуск через Docker Compose

```bash
# Соберите и запустите контейнеры
docker-compose up -d

# Проверьте статус
docker-compose ps

# Просмотр логов
docker-compose logs -f backend
```

### 5. Применение миграций базы данных

```bash
# Войдите в контейнер backend
docker-compose exec backend sh

# Примените миграции
npm run db:migrate

# Выйдите из контейнера
exit
```

### 6. Настройка публичного доступа

Для получения публичного URL используйте один из вариантов:

#### Вариант A: CloudPub (простой способ)

```bash
# На Raspberry Pi
clo publish http 3000
```

#### Вариант B: Nginx + DuckDNS (продакшн)

1. Зарегистрируйтесь на [DuckDNS](https://www.duckdns.org) и получите домен
2. Установите Nginx:

```bash
sudo apt install nginx -y
```

3. Настройте Nginx (`/etc/nginx/sites-available/subscription-tracker`):

```nginx
server {
    listen 80;
    server_name your-domain.duckdns.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Активируйте конфигурацию:

```bash
sudo ln -s /etc/nginx/sites-available/subscription-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. Установите SSL сертификат (опционально, но рекомендуется):

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.duckdns.org
```

### 7. Настройка webhook

После получения публичного URL обновите webhook:

```bash
# Обновите WEBHOOK_URL в .env
nano .env

# Перезапустите backend
docker-compose restart backend

# Обновите webhook
./scripts/update-webhook.sh
```

### 8. Автозапуск при перезагрузке

Docker Compose автоматически настроен на перезапуск контейнеров (`restart: unless-stopped`). Для проверки:

```bash
sudo reboot

# После перезагрузки
docker-compose ps
```

## 🔧 Полезные команды

### Backend

```bash
# Разработка
npm run dev -w backend

# Сборка
npm run build -w backend

# Продакшн
npm run start -w backend

# Генерация миграций
npm run db:generate -w backend

# Применение миграций
npm run db:migrate -w backend

# Drizzle Studio (UI для БД)
npm run db:studio -w backend
```

### Frontend

```bash
# Разработка
npm run dev -w frontend

# Сборка
npm run build -w frontend

# Превью продакшн сборки
npm run preview -w frontend
```

### Docker

```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Пересборка
docker-compose up -d --build

# Логи
docker-compose logs -f

# Очистка
docker-compose down -v  # Удаляет volumes (БД будет очищена!)
```

## 📊 API Endpoints

### Subscriptions

- `GET /api/subscriptions` - Получить все подписки пользователя
- `POST /api/subscriptions` - Создать новую подписку
- `PATCH /api/subscriptions/:id` - Обновить подписку
- `DELETE /api/subscriptions/:id` - Удалить подписку

### Webhook

- `POST /api/webhook` - Telegram webhook endpoint

### Health Check

- `GET /health` - Проверка состояния сервера

## 🔐 Безопасность

- Все API запросы защищены валидацией Telegram WebApp initData
- Используйте HTTPS в продакшене
- Храните `.env` файлы в безопасности (они в `.gitignore`)
- Регулярно обновляйте зависимости

## 🐛 Troubleshooting

### Frontend не подключается к Backend

Проверьте:
1. `VITE_API_URL` в `frontend/.env`
2. CORS настройки в `backend/src/index.ts`
3. Backend запущен и доступен

### Telegram auth не работает

Проверьте:
1. `TELEGRAM_BOT_TOKEN` корректен
2. initData передаётся в заголовке `X-Telegram-Init-Data`
3. Время на сервере синхронизировано (initData валиден 24 часа)

### Уведомления не приходят

Проверьте:
1. Cron job запущен (логи в консоли)
2. `TELEGRAM_BOT_TOKEN` корректен
3. Пользователь начал диалог с ботом (`/start`)

### База данных не подключается

Проверьте:
1. PostgreSQL запущен
2. `DATABASE_URL` корректен
3. База данных создана
4. Миграции применены

## 📝 Примеры Git коммитов

```bash
git init
git add .
git commit -m "feat: initial project setup with React + Express + PostgreSQL"

git commit -m "feat(backend): add subscription CRUD endpoints"
git commit -m "feat(frontend): implement subscription list and calendar"
git commit -m "feat(backend): add notification service with cron jobs"
git commit -m "docs: add comprehensive deployment guide"
git commit -m "chore: configure Docker for Raspberry Pi deployment"
```

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE)

## 🤝 Поддержка

Если у вас возникли вопросы или проблемы, создайте Issue в репозитории.

---

**Создано с ❤️ для управления подписками**

