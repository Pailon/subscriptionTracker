import TelegramBot from 'node-telegram-bot-api';
import { db } from '../db';
import { subscriptions, users } from '../db/schema';
import { eq } from 'drizzle-orm';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false });

// Проверяет подписки и отправляет уведомления
export async function checkAndNotifySubscriptions() {
  try {
    const today = new Date();
    const currentDay = today.getDate();

    // Получаем все активные подписки
    const activeSubscriptions = await db
      .select({
        subscription: subscriptions,
        user: users,
      })
      .from(subscriptions)
      .innerJoin(users, eq(subscriptions.userId, users.id))
      .where(eq(subscriptions.isActive, true));

    for (const { subscription, user } of activeSubscriptions) {
      const daysUntilBilling = calculateDaysUntil(currentDay, subscription.billingDay);

      // Если осталось столько дней, сколько указано в настройках уведомлений
      if (daysUntilBilling === subscription.notifyDaysBefore) {
        const message = formatNotificationMessage(subscription, daysUntilBilling);
        await sendNotification(user.telegramId, message);
      }

      // Уведомление в день списания
      if (daysUntilBilling === 0) {
        const message = formatBillingDayMessage(subscription);
        await sendNotification(user.telegramId, message);
      }
    }

    console.log(`Checked ${activeSubscriptions.length} subscriptions`);
  } catch (error) {
    console.error('Error checking subscriptions:', error);
  }
}

function calculateDaysUntil(currentDay: number, billingDay: number): number {
  if (billingDay >= currentDay) {
    return billingDay - currentDay;
  }
  
  // Если день списания уже прошёл в этом месяце, считаем до следующего месяца
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, billingDay);
  const diffTime = nextMonth.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatNotificationMessage(subscription: any, daysLeft: number): string {
  const price = (subscription.price / 100).toFixed(2);
  const daysText = daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней';
  
  return `🔔 Напоминание о подписке\n\n` +
    `📌 ${subscription.name}\n` +
    `💰 ${price} ${subscription.currency}\n` +
    `⏰ Списание через ${daysLeft} ${daysText}`;
}

function formatBillingDayMessage(subscription: any): string {
  const price = (subscription.price / 100).toFixed(2);
  
  return `💳 Сегодня день списания!\n\n` +
    `📌 ${subscription.name}\n` +
    `💰 ${price} ${subscription.currency}`;
}

async function sendNotification(telegramId: string, message: string) {
  try {
    await bot.sendMessage(telegramId, message, { parse_mode: 'HTML' });
  } catch (error) {
    console.error(`Failed to send notification to ${telegramId}:`, error);
  }
}

