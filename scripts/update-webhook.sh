#!/bin/bash

# Скрипт для автоматической установки Telegram webhook через CloudPub

set -e

# Загружаем переменные окружения
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Проверяем наличие необходимых переменных
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
  echo "❌ Ошибка: TELEGRAM_BOT_TOKEN не установлен"
  exit 1
fi

if [ -z "$WEBHOOK_URL" ]; then
  echo "❌ Ошибка: WEBHOOK_URL не установлен"
  echo "💡 Сначала запустите: clo publish http 3000"
  exit 1
fi

# Устанавливаем webhook
WEBHOOK_ENDPOINT="${WEBHOOK_URL}/api/webhook"

echo "🔧 Устанавливаем webhook..."
echo "📍 URL: $WEBHOOK_ENDPOINT"

RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${WEBHOOK_ENDPOINT}\"}")

if echo "$RESPONSE" | grep -q '"ok":true'; then
  echo "✅ Webhook успешно установлен!"
  
  # Получаем информацию о webhook
  INFO=$(curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo")
  echo ""
  echo "📊 Информация о webhook:"
  echo "$INFO" | jq '.'
else
  echo "❌ Ошибка при установке webhook:"
  echo "$RESPONSE" | jq '.'
  exit 1
fi

