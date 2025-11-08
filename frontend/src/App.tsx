import { useEffect, useState, useMemo } from 'react';
import { initTelegramApp } from './lib/telegram';
import { useSubscriptionStore } from './store/useSubscriptionStore';
import { calculateMonthlyTotal, getNextBilling } from './utils/calculations';
import { MonthlyTotal } from './components/MonthlyTotal';
import { NextBilling } from './components/NextBilling';
import { Calendar } from './components/Calendar';
import { SubscriptionCard } from './components/SubscriptionCard';
import { AddSubscriptionModal } from './components/AddSubscriptionModal';
import { EditSubscriptionModal } from './components/EditSubscriptionModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const { subscriptions, isLoading, error, fetchSubscriptions, addSubscription, updateSubscription, deleteSubscription } =
    useSubscriptionStore();

  useEffect(() => {
    initTelegramApp();
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Получаем уникальные категории из подписок пользователя
  const userCategories = useMemo(() => {
    const categories = new Set(
      subscriptions
        .filter((sub) => sub.category)
        .map((sub) => sub.category as string)
    );
    return ['Все', ...Array.from(categories).sort()];
  }, [subscriptions]);

  const filteredSubscriptions =
    selectedCategory === 'Все'
      ? subscriptions
      : subscriptions.filter((sub) => sub.category === selectedCategory);

  const monthlyTotal = calculateMonthlyTotal(subscriptions);
  const nextBilling = getNextBilling(subscriptions);

  const handleSubscriptionClick = (id: number) => {
    setSelectedSubscriptionId(id);
    setIsEditModalOpen(true);
  };

  const selectedSubscription = subscriptions.find((sub) => sub.id === selectedSubscriptionId);

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
            subscriptions={nextBilling.subscriptions}
            daysLeft={nextBilling.daysLeft}
            totalAmount={nextBilling.totalAmount}
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

          {/* Карусель категорий - показывать только если категорий больше 1 */}
          {userCategories.length > 2 && (
            <div className="mb-4 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {userCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors
                      ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

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
          ) : filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                Нет подписок в категории "{selectedCategory}"
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubscriptions.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onClick={() => handleSubscriptionClick(sub.id)}
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

      {/* Модалка редактирования */}
      {selectedSubscription && (
        <EditSubscriptionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedSubscriptionId(null);
          }}
          subscription={selectedSubscription}
          onUpdate={updateSubscription}
          onDelete={deleteSubscription}
        />
      )}
    </div>
  );
}

export default App;

