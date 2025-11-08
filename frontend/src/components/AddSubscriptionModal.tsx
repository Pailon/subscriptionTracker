import { useState, useEffect } from 'react';
import { DatePicker, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { NewSubscription } from '../types';

type AddSubscriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewSubscription) => Promise<void>;
};

const CATEGORIES = [
  'Стриминг',
  'Музыка',
  'Видео',
  'Софт',
  'Игры',
  'Облако',
  'Образование',
  'Фитнес',
  'Новости',
  'Другое',
];

const CURRENCIES = [
  { key: 'RUB', label: '₽ RUB', symbol: '₽' },
  { key: 'USD', label: '$ USD', symbol: '$' },
  { key: 'EUR', label: '€ EUR', symbol: '€' },
];

export function AddSubscriptionModal({
  isOpen,
  onClose,
  onSubmit,
}: AddSubscriptionModalProps) {
  const [formData, setFormData] = useState<NewSubscription>({
    name: '',
    price: 0,
    currency: 'RUB',
    billingDay: 1,
    category: '',
    notifyDaysBefore: 1,
    periodMonths: 1,
  });

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Блокировка прокрутки при открытом модальном окне
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        price: 0,
        currency: 'RUB',
        billingDay: 1,
        category: '',
        notifyDaysBefore: 1,
        periodMonths: 1,
      });
      setSelectedDate(dayjs());
      onClose();
    } catch (error) {
      console.error('Failed to add subscription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Разрешаем только цифры и точку
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const numValue = value === '' ? 0 : parseFloat(value);
      setFormData({ ...formData, price: numValue });
    }
  };

  const handleNotifyDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numValue = value === '' ? 0 : parseInt(value);
    if (numValue >= 0 && numValue <= 30) {
      setFormData({ ...formData, notifyDaysBefore: numValue });
    }
  };

  const handlePeriodMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numValue = value === '' ? 1 : parseInt(value);
    if (numValue >= 1 && numValue <= 120) {
      setFormData({ ...formData, periodMonths: numValue });
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
      setFormData({ ...formData, billingDay: date.date() });
    }
  };

  const currencyMenuItems: MenuProps['items'] = CURRENCIES.map((curr) => ({
    key: curr.key,
    label: curr.label,
    onClick: () => setFormData({ ...formData, currency: curr.key }),
  }));

  const selectedCurrency = CURRENCIES.find((c) => c.key === formData.currency);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Новая подписка</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Название
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Netflix, Spotify..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Цена
              </label>
              <input
                type="text"
                inputMode="decimal"
                required
                value={formData.price || ''}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Валюта
              </label>
              <Dropdown menu={{ items: currencyMenuItems }} trigger={['click']}>
                <button
                  type="button"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white flex items-center justify-between"
                >
                  <span>{selectedCurrency?.label}</span>
                  <DownOutlined className="text-xs" />
                </button>
              </Dropdown>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              День списания
            </label>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              format="DD.MM.YYYY"
              placeholder="Выберите дату"
              className="w-full"
              style={{ height: '42px' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Категория
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem',
              }}
            >
              <option value="" disabled>
                Выберите категорию
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Период (месяцев)
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={formData.periodMonths}
                onChange={handlePeriodMonthsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="1-120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Уведомить за (дней)
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={formData.notifyDaysBefore}
                onChange={handleNotifyDaysChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="0-30"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Добавление...' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

