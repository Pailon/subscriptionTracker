import { formatPrice } from '../utils/calculations';

type MonthlyTotalProps = {
  total: number;
  currency?: string;
};

export function MonthlyTotal({ total, currency = 'RUB' }: MonthlyTotalProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
      <p className="text-sm opacity-90 mb-2">Всего за месяц</p>
      <p className="text-4xl font-bold">{formatPrice(total, currency)}</p>
    </div>
  );
}

