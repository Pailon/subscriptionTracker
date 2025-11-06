import { Subscription } from '../types';
import { startOfMonth, endOfMonth, addMonths, isSameMonth } from 'date-fns';

// Рассчитывает общую сумму за текущий месяц
export function calculateMonthlyTotal(subscriptions: Subscription[]): number {
  return subscriptions
    .filter((sub) => sub.isActive)
    .reduce((total, sub) => total + sub.price, 0);
}

// Находит ближайшее списание
export function getNextBilling(subscriptions: Subscription[]): {
  subscription: Subscription;
  daysLeft: number;
} | null {
  const today = new Date();
  const currentDay = today.getDate();

  const activeSubscriptions = subscriptions.filter((sub) => sub.isActive);

  if (activeSubscriptions.length === 0) {
    return null;
  }

  let nearest: { subscription: Subscription; daysLeft: number } | null = null;

  for (const sub of activeSubscriptions) {
    const daysLeft = calculateDaysUntil(currentDay, sub.billingDay);

    if (!nearest || daysLeft < nearest.daysLeft) {
      nearest = { subscription: sub, daysLeft };
    }
  }

  return nearest;
}

// Вычисляет количество дней до даты списания
export function calculateDaysUntil(currentDay: number, billingDay: number): number {
  if (billingDay >= currentDay) {
    return billingDay - currentDay;
  }

  // Если день списания уже прошёл в этом месяце
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, billingDay);
  const diffTime = nextMonth.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Получает подписки для календаря (текущий и следующий месяц)
export function getCalendarSubscriptions(
  subscriptions: Subscription[],
  month: Date
): Array<{ date: Date; subscription: Subscription }> {
  const result: Array<{ date: Date; subscription: Subscription }> = [];

  const activeSubscriptions = subscriptions.filter((sub) => sub.isActive);

  for (const sub of activeSubscriptions) {
    const billingDate = new Date(
      month.getFullYear(),
      month.getMonth(),
      sub.billingDay
    );

    if (isSameMonth(billingDate, month)) {
      result.push({ date: billingDate, subscription: sub });
    }
  }

  return result;
}

// Форматирует цену
export function formatPrice(priceInCents: number, currency: string = 'RUB'): string {
  const price = priceInCents / 100;
  
  const currencySymbols: Record<string, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
  };

  const symbol = currencySymbols[currency] || currency;
  
  return `${price.toFixed(2)} ${symbol}`;
}

