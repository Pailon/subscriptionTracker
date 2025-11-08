import { Subscription } from '../types';
import { formatPrice } from '../utils/calculations';

type NextBillingProps = {
  subscriptions: Subscription[];
  daysLeft: number;
  totalAmount: number;
};

export function NextBilling({ subscriptions, daysLeft, totalAmount }: NextBillingProps) {
  const daysText = daysLeft === 0 
    ? 'Сегодня' 
    : daysLeft === 1 
    ? 'Завтра' 
    : `Через ${daysLeft} ${getDaysWord(daysLeft)}`;

  // Если подписка только одна, показываем простой вариант
  if (subscriptions.length === 1) {
    const subscription = subscriptions[0];
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <p className="text-sm text-orange-600 mb-1">Ближайшее списание</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-900">{subscription.name}</p>
            <p className="text-sm text-gray-600">{daysText}</p>
          </div>
          <p className="text-xl font-bold text-orange-600">
            {formatPrice(subscription.price, subscription.currency)}
          </p>
        </div>
      </div>
    );
  }

  // Если подписок несколько, показываем таблицу
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <p className="text-sm text-orange-600 mb-2 font-medium">Ближайшее списание</p>
      <p className="text-sm text-gray-600 mb-3">{daysText}</p>
      
      <div className="space-y-2 mb-3">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="flex justify-between items-center">
            <p className="font-medium text-gray-900">{sub.name}</p>
            <p className="text-sm font-semibold text-gray-700">
              {formatPrice(sub.price, sub.currency)}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-orange-200 flex justify-between items-center">
        <p className="font-semibold text-gray-900">Итого:</p>
        <p className="text-xl font-bold text-orange-600">
          {formatPrice(totalAmount, subscriptions[0]?.currency || 'RUB')}
        </p>
      </div>
    </div>
  );
}

function getDaysWord(days: number): string {
  if (days % 10 === 1 && days % 100 !== 11) return 'день';
  if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дня';
  return 'дней';
}

