import { useEffect, useState } from 'react';
import { initTelegramApp } from './lib/telegram';
import { useSubscriptionStore } from './store/useSubscriptionStore';
import { calculateMonthlyTotal, getNextBilling } from './utils/calculations';
import { MonthlyTotal } from './components/MonthlyTotal';
import { NextBilling } from './components/NextBilling';
import { Calendar } from './components/Calendar';
import { SubscriptionCard } from './components/SubscriptionCard';
import { AddSubscriptionModal } from './components/AddSubscriptionModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { subscriptions, isLoading, error, fetchSubscriptions, addSubscription } =
    useSubscriptionStore();

  useEffect(() => {
    initTelegramApp();
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const monthlyTotal = calculateMonthlyTotal(subscriptions);
  const nextBilling = getNextBilling(subscriptions);

  if (isLoading && subscriptions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Ошибка: {error}</p>
          <button
            onClick={() => fetchSubscriptions()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-gray-900">Мои подписки</h1>

        {/* Общая сумма */}
        <MonthlyTotal total={monthlyTotal} />

        {/* Ближайшее списание */}
        {nextBilling && (
          <NextBilling
            subscription={nextBilling.subscription}
            daysLeft={nextBilling.daysLeft}
          />
        )}

        {/* Календарь */}
        <Calendar subscriptions={subscriptions} />

        {/* Список подписок */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Все подписки</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Добавить
            </button>
          </div>

          {subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">У вас пока нет подписок</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Добавить первую подписку
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onClick={() => {
                    // Можно добавить модалку с деталями
                    console.log('Subscription clicked:', sub);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Модалка добавления */}
      <AddSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addSubscription}
      />
    </div>
  );
}

export default App;

