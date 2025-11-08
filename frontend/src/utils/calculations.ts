import { Subscription } from '../types';
import { isSameMonth } from 'date-fns';

// Рассчитывает общую сумму за текущий месяц
export function calculateMonthlyTotal(subscriptions: Subscription[]): number {
  return subscriptions
    .filter((sub) => sub.isActive)
    .reduce((total, sub) => total + sub.price, 0);
}

// Находит все подписки ближайшего дня списания
export function getNextBilling(subscriptions: Subscription[]): {
  subscriptions: Subscription[];
  daysLeft: number;
  totalAmount: number;
} | null {
  const today = new Date();
  const currentDay = today.getDate();

  const activeSubscriptions = subscriptions.filter((sub) => sub.isActive);

  if (activeSubscriptions.length === 0) {
    return null;
  }

  let minDaysLeft = Infinity;

  // Находим минимальное количество дней до списания
  for (const sub of activeSubscriptions) {
    const daysLeft = calculateDaysUntil(currentDay, sub.billingDay);
    if (daysLeft < minDaysLeft) {
      minDaysLeft = daysLeft;
    }
  }

  // Собираем все подписки с этим минимальным количеством дней
  const nearestSubscriptions = activeSubscriptions.filter((sub) => {
    const daysLeft = calculateDaysUntil(currentDay, sub.billingDay);
    return daysLeft === minDaysLeft;
  });

  const totalAmount = nearestSubscriptions.reduce((sum, sub) => sum + sub.price, 0);

  return {
    subscriptions: nearestSubscriptions,
    daysLeft: minDaysLeft,
    totalAmount,
  };
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

// Проверяет, должна ли подписка списываться в данном месяце с учетом периода
function shouldBillInMonth(subscription: Subscription, targetMonth: Date): boolean {
  const createdDate = new Date(subscription.createdAt);
  const periodMonths = subscription.periodMonths || 1;
  
  // Если период 1 месяц - списывается каждый месяц
  if (periodMonths === 1) {
    return true;
  }
  
  // Вычисляем количество месяцев между датой создания и целевым месяцем
  const monthsDiff = 
    (targetMonth.getFullYear() - createdDate.getFullYear()) * 12 +
    (targetMonth.getMonth() - createdDate.getMonth());
  
  // Проверяем, кратно ли количество месяцев периоду
  return monthsDiff >= 0 && monthsDiff % periodMonths === 0;
}

// Получает подписки для календаря (текущий и следующий месяц)
export function getCalendarSubscriptions(
  subscriptions: Subscription[],
  month: Date
): Array<{ date: Date; subscription: Subscription }> {
  const result: Array<{ date: Date; subscription: Subscription }> = [];

  const activeSubscriptions = subscriptions.filter((sub) => sub.isActive);

  for (const sub of activeSubscriptions) {
    // Проверяем, должна ли подписка списываться в этом месяце
    if (!shouldBillInMonth(sub, month)) {
      continue;
    }

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

