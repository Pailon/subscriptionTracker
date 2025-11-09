import { useState, useEffect } from 'react';
import { DatePicker, Dropdown, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { NewSubscription } from '../types';
import { NumericInput } from './NumericInput';

type AddSubscriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewSubscription) => Promise<void>;
};

export const CATEGORIES = [
  'Стриминг',
  'Музыка',
  'Видео',
  'Софт',
  'Игры',
  'Облако',
  'Образование',
  'Фитнес',
  'Новости',
  'Манга',
  'Инвестиции',
  'Книги',
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
    autoRenewal: true,
  });

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Блокировка прокрутки при открытом модальном окне
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
      // Очищаем форму при закрытии
      setFormData({
        name: '',
        price: 0,
        currency: 'RUB',
        billingDay: 1,
        category: '',
        notifyDaysBefore: 1,
        periodMonths: 1,
        autoRenewal: true,
      });
      setSelectedDate(dayjs());
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
        autoRenewal: true,
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
    if (value === '') {
      setFormData({ ...formData, periodMonths: undefined as any });
      return;
    }
    const numValue = parseInt(value);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center md:p-4 z-50" style={{ height: '100dvh' }}>
      <div className="bg-white rounded-t-2xl md:rounded-lg max-w-md w-full p-6 max-h-[85dvh] md:max-h-[90vh] overflow-y-auto animate-slide-up">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Новая подписка</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <NumericInput
              label="Название"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Netflix, Spotify..."
              required
              inputMode="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <NumericInput
                label="Цена"
                value={formData.price || ''}
                onChange={handlePriceChange}
                placeholder="0"
                required
                inputMode="decimal"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Валюта
              </label>
              <Dropdown
                menu={{ items: currencyMenuItems }}
                trigger={['click']}
                getPopupContainer={(trigger) => trigger.parentElement || document.body}
              >
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
              getPopupContainer={(trigger) => trigger.parentElement || document.body}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Категория
            </label>
            <Select
              value={formData.category || undefined}
              onChange={(value) => setFormData({ ...formData, category: value })}
              placeholder="Выберите категорию"
              className="w-full"
              style={{ height: '42px' }}
              options={CATEGORIES.map((cat) => ({ label: cat, value: cat }))}
              getPopupContainer={(trigger) => trigger.parentElement || document.body}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <NumericInput
                label="Длительность (месяцев)"
                value={formData.periodMonths || ''}
                onChange={handlePeriodMonthsChange}
                placeholder="1-120"
                required
                inputMode="numeric"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">На сколько месяцев оформлена подписка</p>
            </div>

            <div>
              <NumericInput
                label="Уведомить за (дней)"
                value={formData.notifyDaysBefore !== undefined ? formData.notifyDaysBefore : ''}
                onChange={handleNotifyDaysChange}
                placeholder="0-30"
                required
                inputMode="numeric"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">0 = уведомить в день списания</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="autoRenewal"
              checked={formData.autoRenewal}
              onChange={(e) => setFormData({ ...formData, autoRenewal: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="autoRenewal" className="text-sm text-gray-700">
              <span className="font-medium">Автопродление</span>
              <p className="text-xs text-gray-500 mt-0.5">
                Подписка будет отображаться в календаре и приходить уведомления каждые {formData.periodMonths || 1} {formData.periodMonths === 1 ? 'месяц' : formData.periodMonths && formData.periodMonths < 5 ? 'месяца' : 'месяцев'}
              </p>
            </label>
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

