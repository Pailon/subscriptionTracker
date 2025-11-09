import { Subscription } from '../types';
import { formatPrice } from '../utils/calculations';

type SubscriptionCardProps = {
  subscription: Subscription;
  onClick: () => void;
};

export function SubscriptionCard({ subscription, onClick }: SubscriptionCardProps) {
  const periodMonths = subscription.periodMonths || 1;
  const periodText = periodMonths === 1 
    ? 'Списание каждый месяц' 
    : `Списание каждые ${periodMonths} ${getMonthsWord(periodMonths)}`;
  
  const notifyText = subscription.notifyDaysBefore === 0
    ? 'Уведомление в день списания'
    : subscription.notifyDaysBefore === 1
    ? 'Уведомление придет за 1 день'
    : `Уведомление придет за ${subscription.notifyDaysBefore} ${getDaysWord(subscription.notifyDaysBefore)}`;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-900">{subscription.name}</h3>
        <span className="text-sm text-gray-500">
          {subscription.billingDay} числа
        </span>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <span className="text-2xl font-bold text-blue-600">
          {formatPrice(subscription.price, subscription.currency)}
        </span>
        
        {subscription.category && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {subscription.category}
          </span>
        )}
      </div>

      <div className="space-y-1 text-xs text-gray-500 border-t pt-2">
        <p>{periodText}</p>
        <p>{notifyText}</p>
      </div>
    </div>
  );
}

function getMonthsWord(months: number): string {
  if (months % 10 === 1 && months % 100 !== 11) return 'месяц';
  if ([2, 3, 4].includes(months % 10) && ![12, 13, 14].includes(months % 100)) return 'месяца';
  return 'месяцев';
}

function getDaysWord(days: number): string {
  if (days % 10 === 1 && days % 100 !== 11) return 'день';
  if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дня';
  return 'дней';
}

