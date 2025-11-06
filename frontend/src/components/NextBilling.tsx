import { Subscription } from '../types';
import { formatPrice } from '../utils/calculations';

type NextBillingProps = {
  subscription: Subscription;
  daysLeft: number;
};

export function NextBilling({ subscription, daysLeft }: NextBillingProps) {
  const daysText = daysLeft === 0 
    ? 'Сегодня' 
    : daysLeft === 1 
    ? 'Завтра' 
    : `Через ${daysLeft} ${getDaysWord(daysLeft)}`;

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

function getDaysWord(days: number): string {
  if (days % 10 === 1 && days % 100 !== 11) return 'день';
  if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дня';
  return 'дней';
}

