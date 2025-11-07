# 🚀 ФИНАЛЬНАЯ ИНСТРУКЦИЯ ДЛЯ RASPBERRY PI

## ✅ Все проблемы исправлены!

Были исправлены 3 критические проблемы:
1. ❌ Папка `drizzle` не существовала → ✅ Удалена из Dockerfile
2. ❌ `.dockerignore` блокировал `dist` → ✅ Исправлен
3. ❌ Volume монтирование перезаписывало файлы → ✅ Удалено

## 📋 Команды для выполнения на Raspberry Pi

### 1. Перейдите в директорию проекта
```bash
cd ~/subscriptionTracker
```

### 2. Получите последние изменения
```bash
git pull
```

### 3. Остановите старые контейнеры
```bash
docker-compose down
```

### 4. Пересоберите образы БЕЗ кеша (важно!)
```bash
docker-compose build --no-cache
```

### 5. Запустите контейнеры
```bash
docker-compose up -d
```

### 6. Проверьте логи
```bash
docker-compose logs -f backend
```

**Что вы должны увидеть:**
```
subscription_tracker_backend | 🚀 Server running on port 3000
subscription_tracker_backend | 📊 Environment: production
```

### 7. Проверьте health endpoint
```bash
curl http://localhost:3000/health
```

**Ожидаемый ответ:**
```json
{"status":"ok","timestamp":"2025-11-07T..."}
```

## 🔧 Если что-то пошло не так

### Полная очистка и пересборка
```bash
# Остановить всё
docker-compose down -v

# Удалить образы
docker rmi subscription_tracker_backend

# Очистить Docker кеш
docker system prune -a -f

# Пересобрать
docker-compose build --no-cache

# Запустить
docker-compose up -d
```

### Проверка переменных окружения
```bash
cat .env
```

Убедитесь что заполнены:
- `POSTGRES_PASSWORD`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_BOT_USERNAME`
- `FRONTEND_URL`
- `WEBHOOK_URL`

### Проверка контейнеров
```bash
# Статус
docker-compose ps

# Логи PostgreSQL
docker-compose logs postgres

# Логи Backend
docker-compose logs backend

# Войти в контейнер backend
docker-compose exec backend sh
ls -la dist/  # Проверить что файлы есть
exit
```

## 📊 Мониторинг

```bash
# Логи в реальном времени
docker-compose logs -f

# Использование ресурсов
docker stats

# Перезапуск при необходимости
docker-compose restart backend
```

## ✅ Готово!

После успешного запуска:
- Backend доступен на `http://localhost:3000`
- PostgreSQL на `localhost:5432`
- Health check: `http://localhost:3000/health`

## 🔄 Обновление в будущем

```bash
git pull
docker-compose up -d --build
```

---

**Важно:** Если видите ошибку `MODULE_NOT_FOUND`, значит не была выполнена команда `docker-compose build --no-cache`. Docker кеш может содержать старую версию без исправлений.

