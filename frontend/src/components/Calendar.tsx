import { useState } from 'react';
import { Modal } from 'antd';
import { Subscription } from '../types';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { getCalendarSubscriptions, formatPrice } from '../utils/calculations';

type CalendarProps = {
  subscriptions: Subscription[];
};

export function Calendar({ subscriptions }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const calendarSubs = getCalendarSubscriptions(subscriptions, currentMonth);

  const getSubscriptionsForDay = (date: Date) => {
    return calendarSubs.filter((item) => isSameDay(item.date, date));
  };

  const handleDayClick = (date: Date, daySubs: Array<{ date: Date; subscription: Subscription }>) => {
    if (daySubs.length > 0) {
      setSelectedDate(date);
      setIsModalOpen(true);
    }
  };

  const selectedDaySubs = selectedDate ? getSubscriptionsForDay(selectedDate) : [];
  const totalAmount = selectedDaySubs.reduce((sum, item) => sum + item.subscription.price, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded text-gray-700"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, 'LLLL yyyy', { locale: ru })}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded text-gray-700"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}

        {/* Пустые ячейки для выравнивания */}
        {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {daysInMonth.map((date) => {
          const daySubs = getSubscriptionsForDay(date);
          const hasSubscriptions = daySubs.length > 0;

          return (
            <div
              key={date.toISOString()}
              onClick={() => handleDayClick(date, daySubs)}
              className={`
                aspect-square p-2 flex items-center justify-center rounded relative
                ${hasSubscriptions ? 'bg-blue-500 text-white font-bold cursor-pointer hover:bg-blue-600' : 'border border-gray-100 text-gray-900'}
              `}
            >
              <div className="text-sm font-medium">{format(date, 'd')}</div>
              {hasSubscriptions && daySubs.length > 1 && (
                <div
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                  style={{ transform: 'translate(25%, -25%)' }}
                >
                  {daySubs.length}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Модальное окно с подписками дня */}
      <Modal
        title={selectedDate ? format(selectedDate, 'd MMMM yyyy', { locale: ru }) : ''}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={
          selectedDaySubs.length > 1 ? (
            <div className="flex justify-between items-center px-4 py-2 border-t">
              <span className="font-semibold text-gray-900">Итого:</span>
              <span className="text-lg font-bold text-blue-600">
                {formatPrice(totalAmount, selectedDaySubs[0]?.subscription.currency || 'RUB')}
              </span>
            </div>
          ) : null
        }
      >
        <div className="space-y-3">
          {selectedDaySubs.map((item) => (
            <div
              key={item.subscription.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{item.subscription.name}</p>
                {item.subscription.category && (
                  <p className="text-xs text-gray-500 mt-1">{item.subscription.category}</p>
                )}
              </div>
              <p className="text-lg font-semibold text-blue-600">
                {formatPrice(item.subscription.price, item.subscription.currency)}
              </p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

