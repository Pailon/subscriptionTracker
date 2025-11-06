import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface AuthenticatedRequest extends Request {
  telegramUser?: TelegramUser;
}

// Валидация initData от Telegram WebApp
export function validateTelegramWebAppData(initData: string, botToken: string): TelegramUser | null {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    if (!hash) {
      return null;
    }

    // Сортируем параметры и создаём строку для проверки
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Создаём секретный ключ
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Вычисляем хеш
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Сравниваем хеши
    if (calculatedHash !== hash) {
      return null;
    }

    // Парсим данные пользователя
    const userParam = urlParams.get('user');
    if (!userParam) {
      return null;
    }

    const user = JSON.parse(userParam);
    const authDate = parseInt(urlParams.get('auth_date') || '0', 10);

    // Проверяем, что данные не старше 24 часов
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - authDate > 86400) {
      return null;
    }

    return {
      ...user,
      auth_date: authDate,
      hash,
    };
  } catch (error) {
    console.error('Telegram auth validation error:', error);
    return null;
  }
}

export function telegramAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const initData = req.headers['x-telegram-init-data'] as string;

  if (!initData) {
    res.status(401).json({ error: 'Missing Telegram init data' });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const user = validateTelegramWebAppData(initData, botToken);

  if (!user) {
    res.status(401).json({ error: 'Invalid Telegram init data' });
    return;
  }

  req.telegramUser = user;
  next();
}

