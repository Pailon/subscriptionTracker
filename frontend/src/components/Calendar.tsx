import { useState } from 'react';
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
import { getCalendarSubscriptions } from '../utils/calculations';

type CalendarProps = {
  subscriptions: Subscription[];
};

export function Calendar({ subscriptions }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const calendarSubs = getCalendarSubscriptions(subscriptions, currentMonth);

  const getSubscriptionsForDay = (date: Date) => {
    return calendarSubs.filter((item) => isSameDay(item.date, date));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'LLLL yyyy', { locale: ru })}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
          <div key={day} className="text-center text-xs text-gray-500 py-2">
            {day}
          </div>
        ))}

        {/* Пустые ячейки для выравнивания */}
        {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {daysInMonth.map((date) => {
          const daySubs = getSubscriptionsForDay(date);
          const hasSubscriptions = daySubs.length > 0;

          return (
            <div
              key={date.toISOString()}
              className={`
                aspect-square p-1 text-center rounded
                ${hasSubscriptions ? 'bg-blue-50 border border-blue-200' : ''}
              `}
            >
              <div className="text-sm font-medium">{format(date, 'd')}</div>
              {hasSubscriptions && (
                <div className="text-xs text-blue-600 mt-1">
                  {daySubs.length}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

