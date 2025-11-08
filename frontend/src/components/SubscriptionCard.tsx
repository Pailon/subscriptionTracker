import { Subscription } from '../types';
import { formatPrice } from '../utils/calculations';

type SubscriptionCardProps = {
  subscription: Subscription;
  onClick: () => void;
};

export function SubscriptionCard({ subscription, onClick }: SubscriptionCardProps) {
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
      
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-blue-600">
          {formatPrice(subscription.price, subscription.currency)}
        </span>
        
        {subscription.category && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {subscription.category}
          </span>
        )}
      </div>
    </div>
  );
}

